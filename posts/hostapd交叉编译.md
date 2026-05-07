# hostapd交叉编译

针对你的需求（解决之前遇到的FILS不支持问题），我整理了hostapd交叉编译的完整步骤。根据搜索结果，hostapd交叉编译的核心是**先编译依赖库，再编译hostapd本身**。

## 一、准备工作

### 1.1 确认交叉编译工具链

```bash
# 查看你的交叉编译工具链（根据你的实际环境调整）
aarch64-linux-gnu-gcc --version
# 或
arm-linux-gnueabihf-gcc --version
```

### 1.2 下载源码

```bash
# hostapd（你已经有2.11版本）
# 如果需要重新下载：https://w1.fi/releases/

# libnl（hostapd依赖）
wget https://github.com/thom311/libnl/releases/download/libnl3_9_0/libnl-3.9.0.tar.gz

# openssl（hostapd依赖）
wget https://www.openssl.org/source/openssl-1.1.1t.tar.gz
```

## 二、编译依赖库

### 2.1 设置环境变量

```bash
# 定义交叉编译工具链前缀（根据你的实际工具链修改）
export CROSS_COMPILE=aarch64-linux-gnu-
export CC=${CROSS_COMPILE}gcc
export AR=${CROSS_COMPILE}ar
export LD=${CROSS_COMPILE}ld

# 定义安装目录
export SYSROOT=$(pwd)/install_dir
mkdir -p $SYSROOT
```

### 2.2 编译libnl

```bash
tar -xvf libnl-3.9.0.tar.gz
cd libnl-3.9.0

# 创建安装目录
mkdir -p build

# 配置
./configure \
  --host=aarch64-linux-gnu \
  --prefix=$(pwd)/build \
  CC=${CC} \
  AR=${AR} \
  LD=${LD}

# 编译和安装
make -j4
make install

# 记录libnl路径（后续hostapd编译需要）
export LIBNL_PATH=$(pwd)/build
cd ..
```

### 2.3 编译openssl

```bash
tar -xvf openssl-1.1.1t.tar.gz
cd openssl-1.1.1t

# 创建安装目录
mkdir -p build

# 配置（注意：no-asm很重要，因为汇编代码不兼容ARM架构）
./Configure \
  no-asm \
  shared \
  no-async \
  --prefix=$(pwd)/build \
  --cross-compile-prefix=${CROSS_COMPILE} \
  linux-aarch64

# 编译和安装
make -j4
make install

# 记录openssl路径
export OPENSSL_PATH=$(pwd)/build
cd ..
```

### 2.4 验证依赖库

```bash
# 检查生成的库文件
ls -l $LIBNL_PATH/lib/libnl-3.so*
ls -l $OPENSSL_PATH/lib/libssl.so*
```

## 三、编译hostapd

### 3.1 准备编译配置

```bash
# 进入hostapd目录（你已经有2.11版本）
cd hostapd-2.11/hostapd

# 复制默认配置文件
cp defconfig .config
```

### 3.2 修改.config文件

```bash
# 编辑.config文件
vim .config

# 确保以下选项被启用（按需添加）
CONFIG_DRIVER_NL80211=y
CONFIG_LIBNL32=y
CONFIG_IEEE80211N=y
CONFIG_IEEE80211AC=y
CONFIG_IEEE80211AX=y      # 如果需要11ax支持
CONFIG_FILS=y             # 重点：启用FILS支持（解决之前的问题）

# 添加依赖库路径（直接添加到.config文件末尾）
CFLAGS += -I$(LIBNL_PATH)/include/libnl3
CFLAGS += -I$(OPENSSL_PATH)/include
LIBS += -L$(LIBNL_PATH)/lib
LIBS += -L$(OPENSSL_PATH)/lib
```

### 3.3 修改Makefile

```bash
# 编辑Makefile，指定交叉编译器
vim Makefile

# 在文件开头（ifndef CC之前）添加：
CC=aarch64-linux-gnu-gcc
AR=aarch64-linux-gnu-ar
LD=aarch64-linux-gnu-ld

# 或者使用环境变量方式
# export CC=aarch64-linux-gnu-gcc
```

### 3.4 设置PKG_CONFIG_PATH

```bash
# 这是关键步骤！让hostapd能找到libnl的.pc文件
export PKG_CONFIG_PATH=$LIBNL_PATH/lib/pkgconfig:$PKG_CONFIG_PATH

# 验证
pkg-config --list-all | grep libnl
```

### 3.5 编译

```bash
# 开始编译
make clean
make V=1 -j4

# 编译成功后，会在当前目录生成hostapd和hostapd_cli
ls -l hostapd hostapd_cli
```

### 3.6 常见编译错误及解决

|错误信息|解决方法|
| --------------| --------------------------------------------|
|​`cannot find -lnl-3`|检查PKG_CONFIG_PATH设置是否正确|
|​`openssl/ssl.h: No such file`|检查CFLAGS中的-I路径是否正确|
|​`libnl-genl-3.0`相关错误|确保libnl编译时生成了所有库，重新编译libnl|
|​`undefined reference to`|通常是链接顺序问题，检查LIBS中的-L路径|
|汇编错误|编译openssl时必须加`no-asm`参数|

## 四、启用FILS支持（解决你的核心问题）

### 4.1 在.config中确保以下配置

```bash
# 必须启用的选项
CONFIG_FILS=y
CONFIG_FILS_SK_PFS=y        # 可选，增加安全性
CONFIG_IEEE80211W=y          # 管理帧保护，与FILS相关
```

### 4.2 验证编译出的hostapd

```bash
# 查看是否包含FILS支持
./hostapd -v
# 或
strings hostapd | grep -i fils
# 如果有输出，说明FILS已成功编译进去
```

## 五、部署到目标板

### 5.1 拷贝文件

```bash
# 将编译好的文件拷贝到目标板的rootfs
cp hostapd $TARGET_ROOTFS/usr/sbin/
cp hostapd_cli $TARGET_ROOTFS/usr/sbin/

# 拷贝依赖库
cp -d $LIBNL_PATH/lib/libnl-3.so* $TARGET_ROOTFS/usr/lib/
cp -d $LIBNL_PATH/lib/libnl-genl-3.so* $TARGET_ROOTFS/usr/lib/
cp -d $OPENSSL_PATH/lib/libssl.so* $TARGET_ROOTFS/usr/lib/
cp -d $OPENSSL_PATH/lib/libcrypto.so* $TARGET_ROOTFS/usr/lib/
```

### 5.2 在目标板上测试

```bash
# 在目标板上运行
hostapd -v
# 如果之前的问题是因为hostapd不支持FILS，现在应该可以通过配置关闭了
```

## 六、针对你之前问题的配置

编译成功后，在`hostapd_rid.conf`中就可以使用以下配置来控制FILS帧了：

```bash
# 彻底关闭FILS Discovery
fils_discovery_max_interval=0

# 或设置较长的发送间隔（单位：TU，1TU≈1.024ms）
fils_discovery_max_interval=200  # 约200ms发送一次
```

## 总结

hostapd交叉编译的核心流程是：

1. **先编译libnl和openssl**（注意`no-asm`参数）
2. **设置PKG_CONFIG_PATH**让hostapd能找到依赖
3. **修改.config启用所需功能**（包括`CONFIG_FILS=y`）
4. **编译并验证**

这样编译出来的hostapd就能支持FILS配置，解决你之前遇到的`unknown configuration item`问题。

‍

‍

‍

---

```C
# 使用 -f 参数而不是 -Y
sudo tshark -i wlx7cdd907bc832 -f "type mgt and subtype beacon and ether src 42:d9:5a:b0:5c:34" -c 3 -T fields -e wlan.tag.vendor.data
```

‍

‍

```C
sudo tshark -i wlx7cdd907bc832 -f "type mgt and subtype beacon and ether src 40:d9:5a:b0:5c:34" -T fields -e frame.time_relative -e wlan.tag.vendor.data 2>/dev/null
```

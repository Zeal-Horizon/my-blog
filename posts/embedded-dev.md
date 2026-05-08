---
title: "嵌入式开发的十年：从单片机到 Linux 系统"
date: "2026-04-15"
tags: ["嵌入式", "Linux", "职业成长"]
description: "回顾十年嵌入式开发之路，从 8 位单片机到嵌入式 Linux，分享技术演进与个人成长的思考。"
---

## 起点：8 位单片机时代

2016 年，我开始了嵌入式开发之旅。第一块开发板是 STC89C52，经典的 8051 架构。

那时候的开发工具链很简单：

- Keil C51 集成开发环境
- 串口下载程序
- 逻辑分析仪调试时序

```c
// 一个经典的 LED 闪烁程序
#include <reg52.h>

sbit LED = P1^0;

void delay(unsigned int ms) {
    unsigned int i, j;
    for (i = ms; i > 0; i--)
        for (j = 110; j > 0; j--);
}

void main() {
    while (1) {
        LED = 0;
        delay(500);
        LED = 1;
        delay(500);
    }
}
```

## 转向 ARM Cortex-M

随着项目复杂度提升，我开始接触 STM32 系列。从标准库到 HAL 库，从裸机到 FreeRTOS，每一步都是新的认知突破。

关键转变包括：

- **中断管理**：理解优先级与嵌套
- **DMA 传输**：释放 CPU 资源
- **RTOS 概念**：任务调度与资源同步

## 进入嵌入式 Linux

2020 年是一个转折点。我开始涉足嵌入式 Linux 开发，从驱动到应用，从 uboot 到根文件系统构建。

```bash
# 使用 Buildroot 构建嵌入式 Linux 系统
make raspberrypi3_defconfig
make
# 输出: output/images/ 下的镜像文件
```

### 学习曲线

嵌入式 Linux 的学习曲线比单片机陡峭得多：

1. **Bootloader** — uboot 启动流程与定制
2. **内核** — 设备树、驱动框架、内核配置
3. **根文件系统** — BusyBox、Buildroot、Yocto
4. **应用层** — 交叉编译、系统编程

## 写在最后

十年嵌入式开发，让我深刻理解了一句话：**"软件是跑在硬件上的，硬件是焊在板子上的。"**

从点亮一个 LED 到驱动复杂的多媒体系统，嵌入式开发的魅力在于它始终让你面对真实的物理世界。

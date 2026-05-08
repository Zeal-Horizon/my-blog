---
title: "用 systemd 管理嵌入式 Linux 服务"
date: "2026-01-05"
tags: ["嵌入式", "Linux", "systemd"]
description: "嵌入式 Linux 中 systemd 的实用配置技巧，包括服务编写、定时任务和依赖管理。"
---

## systemd 在嵌入式中的角色

现代嵌入式 Linux 系统几乎都使用 systemd 作为 init 系统。它为嵌入式开发提供了强大的服务管理能力。

## 编写一个简单的服务

```ini
[Unit]
Description=温度监控服务
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/temp-monitor
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
```

### 服务管理命令

```bash
# 启动服务
systemctl start temp-monitor

# 设置开机自启
systemctl enable temp-monitor

# 查看状态
systemctl status temp-monitor

# 查看日志
journalctl -u temp-monitor -f
```

## 实用场景

### 1. 看门狗集成

```ini
[Service]
Type=simple
ExecStart=/usr/bin/watchdog-app
Restart=always
RestartSec=3
WatchdogSec=10
```

### 2. 文件系统挂载顺序

处理复杂的启动依赖：

```ini
[Unit]
Description=数据分区挂载
Requires=dev-sda1.device
After=dev-sda1.device

[Mount]
What=/dev/sda1
Where=/data
Type=ext4
Options=noatime
```

### 3. 定时任务替代方案

使用 systemd timer 替代 cron：

```ini
# log-cleaner.timer
[Unit]
Description=定期清理日志

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

```ini
# log-cleaner.service
[Unit]
Description=清理过期日志

[Service]
Type=oneshot
ExecStart=/usr/bin/log-cleaner --days=30
```

## 调试技巧

```bash
# 分析启动时间
systemd-analyze blame

# 检查服务依赖图
systemctl list-dependencies temp-monitor

# 模拟启动
systemd-analyze verify /etc/systemd/system/temp-monitor.service
```

## 总结

在嵌入式 Linux 中，systemd 不仅是一个 init 系统，更是一个完整的服务管理框架。合理利用它的特性，可以大幅提升嵌入式设备的稳定性和可维护性。

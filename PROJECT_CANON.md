# 唯一正式工程（必读）

- **本项目路径**：`D:\labyrinthos-ui`
- **八种月相 + 完整首页**：只在本仓库维护，勿再复制出第二份工程以免搞混端口与内容。

## 怎么运行（以后固定这样）

```bash
cd D:\labyrinthos-ui
npm run dev
```

浏览器打开终端里显示的地址，**固定为**：

**http://localhost:3088**

（已在 `package.json` 里写死端口，避免与电脑上其他 Next 项目抢 3000/3001。）

## 打包后运行

```bash
npm run build
npm run start
```

同样在 **3088** 端口。

## Cursor

请用 **文件 → 打开文件夹** 选择 **`D:\labyrinthos-ui`**。

### 若 `D:\liuyao` 仍存在（占用的旧副本）

1. 在 **所有** 终端里对 `liuyao` 的 `npm run dev` 按 **Ctrl+C** 停掉。  
2. 在 Cursor：**文件 → 关闭文件夹**，再 **打开文件夹 → `D:\labyrinthos-ui`**。  
3. 关闭仍占用 `D:\liuyao` 的其他程序后，在资源管理器里 **右键删除** 文件夹 `D:\liuyao`，或在 PowerShell 执行：  
   `Remove-Item -LiteralPath "D:\liuyao" -Recurse -Force`

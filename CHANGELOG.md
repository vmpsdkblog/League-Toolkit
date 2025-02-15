# 1.1.0 (2024-02-05)

## 新增

- 支持查询具有 tag 的召唤师名称，如 `一色彩羽#123456`。输入时需包括 `#` 符号。

- 在随机模式的自动选择功能中，提供了一个选项：在聊天室中以**仅自己可见**的特殊消息，实时展示即将执行的选择操作。

## 修复

- 修复了一个错误，当自动选择英雄指定了多个英雄时，会出现无限循环选择的情况。

## 调整

- 重新修改了设置项的布局，功能介绍更加清晰。

- 出于效率考虑，现在将始终要求以管理员权限启动。因此，“尝试自动连接”设置项也被移除，现在将始终自动连接。

- 调整了命令行的执行方式。

- 使用 native 方法检查权限。

# 1.0.5 (2024-01-11)

## 新增

- 优化了自动选择英雄及禁用英雄功能。现在将根据预设的优先级列表进行操作，同时也会考虑队友的预选和禁用情况。同时，除了按照优先级选择之外，现在也允许随机挑选列表内的英雄进行选择或禁用操作。

## 修复

- 自动 ban 功能出现异常的问题。

- 在拒绝接受时自动取消自动接受。

- 修复竞技场战绩数据错误时，界面出错的问题。现在将尽可能展示内容。

- 修复关闭了自动连接，导致以管理员权限启动时不会连接的问题。

## 调整

- 现在对局中玩家卡片会展示标签“我”，以及“遇到过”标签不会对自己生效。

- 回调自动选择/自动禁用功能，现在在自定义对局也能生效。

# 1.0.4 (2024-01-06)

## 新增

- 在战绩页面，可以使用 `Ctrl+Left` 或 `Ctrl+Right` 来控制翻页了。

- 战绩卡片会额外展示一些统计信息。

- 自动禁用英雄功能。

## 调整

- 现在战绩页面列表的拉取详细战绩选项将默认开启。（在上个版本是默认关闭的）

- 连接到客户端时，若在管理员权限下，只有达到固定的试错次数时才会显示错误信息。

- “对局中”中，“生涯隐藏”、“胜率队”等样式不会对自己生效。

- 自动选择 / 自动禁用英雄不会在自定义对局中生效。

## 修复

- “对局中”页面的简易战绩列表中，训练模式对局的背景色和胜负将被灰色和“-”符号替代。

## 优化

- 在战绩页面，请求得到的的详细对局都会被部分缓存，以便复用并减少调用接口的次数。

# 1.0.3 (2024-01-01)

新年快乐！

## 新增

- 新增设置选项（设置 -> 战绩 -> 通用 -> 拉取详细对局），允许在加载战绩列表时同时获取详细战绩信息。该选项默认关闭。请注意，频繁的接口请求可能触发服务器限制，因此请避免短时间内频繁请求战绩数据。

- 战绩卡片现在在获取了详细对局数据时，会在右侧显示该局游戏的玩家列表。（本功能其实早该实现了）

## 修复

- 修复了在战绩页面，当未输入页码时，获取战绩数据出现范围错误的问题。现在默认总是设为第 1 页。

- 补充了对局中玩家卡片中竞技场统计为空的默认占位元素。

## 调整

- 底层依赖更新 (vue => 3.4, electron => 28.1, 等)。

- 进行了一些微小的样式调整和改进。

# 1.0.2 (2023-12-31)

## 新增

- 提供了一个选项，当启动时，通过 Github 检查更新。该选项默认是开启的。

# 1.0.1 (2023-12-30)

## 调整

- 调整获取 LCU 命令行的方式。

- 在英雄选择台，给不可选择的英雄添加一个视觉效果并使其无法选定。

# 1.0.0 (2023-12-17)

版本发布。

# React 基本理论概念 #

该文档是我尝试对于我理解的React心智模型的基本说明。目的是根据促成我们这种设计的推导理由来描述这些模型。

或许一定会有些假设有待商榷，并且该例子的实际设计会有一些bug和不足。这只是标准化的开始。从简单到复杂的展开过程中需要沿着一条不需要表现太多代码库细节进行。

React.js实际的代码实现充满了程序实现、增量代码，算法优化，遗留代码，调试工具和需要使其真正有用处的东西。所有这些都是敏捷的，如果某项有足够价值并且有足够高的优先级总是在发生变化。实际的实现更加困难的举出。

我喜欢作一个简单的心智模型来打好基础。


##### 转换Transformation  #####

对于React最核心的假设是视图只是数据到另一种形式的数据的映射。相同输入会给出相同的输出。一个简单的纯函数：

```javascript
function NameBox(name) {
    return {fontWeight: 'bold', labelContent: name};
}
/*
'bob'->
{fontWeight: 'bold', labelContent: 'bob'};
*/

```
##### 抽象 Abstraction #####

然而你不能将复杂的UI都放到一个函数中。UI能够被抽象成为一个可复用的不会暴露其实现细节的单元。例如从一个函数中调用调用另一个：

```javascript
function FancyUserBox(user) {
    return {
        borderStyle: '1px solid blue',
        childContent: [
            'Name',
            NameBox(user.firstName + ' ' + user.lastName),
        ]
    }

}
/*
{ firstName: 'Sebastian', lastName: 'Markbåge' } ->
{
  borderStyle: '1px solid blue',
  childContent: [
    'Name: ',
    { fontWeight: 'bold', labelContent: 'Sebastian Markbåge' }
  ]
};
 */
```

##### 组合 Composition #####

要实现真正的可复用特性，仅是可以重复使用叶节点和为其创建新的容器是不够的。你也需要能够无从容器上创建抽象单元来组合其他的抽象单元。我认为‘composition’组合的原理就是它们能够将两个或多个抽象单元组合到一起形成一个新的抽象单元。

```javascript
function FancyBox(children) {
    return {
        borderStyle: '1px solid blue',
        children: children
    };
}
function UserBox(user) {
    return FancyBox([
        'Name',
        NameBox(user.firstName + ' ' + user.lastName),
    ])
}
```

##### 状态State #####

UI视图不简单的是服务器端/业务逻辑状态的复制,有很多的特定于某个精确的映射而不是其它的映射的状态。例如，如果你开始在输入框输入。或许需要也或许不需要在其他的地方或你移动设备中复制。滚动位置是一个典型的例子，你几乎不需要通过多层映射来复制他。

```javascript
function FancyNameBox(user, likes, onClick) {
    return FancyBox([
        'Name: ', NameBox(user.firstName + ' ' + user.lastName),
        'Likes: ', LikeBox(likes),
        LikeButton(onClick)
    ])
}
// 实现细节

var likes = 0;
function addOneMoreLike() {
    likes++;
    rerender();
}
// 初始
FancyNameBox(
    { firstName: 'Sebastian', lastName: 'Markbåge' },
    likes,
    addOneMoreLike
);

```
##### 记忆化 Memoization #####

在我们知道函数是纯粹的函数时，一次又一次的调用相同的函数很浪费资源。我们可以创建一个函数记忆版本来保持追踪最后一次的函数参数和结果。那样我们就不必重复执行如果我们保持使用相同的值。

```javascript
function memoize(fn) {
    var cachedArg;
    var cachedResult;

    return function (arg) {
        if (cachedArg === arg) {
            return cachedResult;
        }
        cachedArg = arg;
        cachedResult = fn(arg);
        return cachedResult;
    }
}

var MemoizedNameBox = memoize(NameBox);

function NameAndAgeBox(user, currentTime) {
    return FancyBox([
        'Name',
        MemoizedNameBox(user.firstName + ' ' + user.lastName),
        'Age in milliseconds: ',
        currentTime - user.dateOfBirth
    ])

}
```
##### 列表 Lists #####

大部分UI视图是一些列表的形式以及由其产生的在一个列表中多个不同值的条目。这将创建自然的层次结构。

为了管理列表中每个条目的状态，我们创建一个字典来放置每个特定条目的状态。

```javascript
function UserList(user, likesPerUser, updateUserLikes) {
    return user.map(user => FancyNameBox(
        user,
        likesPerUser.get(user.id),
        () => updateUserLikes(user.id, likesPerUser.get(user.id) + 1)
    ))
}

var likesPerUser = new Map();
function uupdateUserLikes(id,likeCount) {
    likesPerUser.set(id,likeCount);
    renderer()
}
UserList(data.users,likesPerUser,uupdateUserLikes);

```
注意：我们现在给FancyNameBox传入过得不同的参数。那影响了函数记忆，因为我们一次只能记住一个参数。下面会更详细说明。

##### 延续 Continuations #####

可惜的是，因为在UI视图中有很多的列表的列表展示，变成了一大堆的样板文件来精确的管理。

我们可以使用延迟执行一个函数来将这些样板文件移动到我们关键业务逻辑之外。例如，使用绑定（bind）.那样从我们核心函数之外传递进来的状态就不绑定样板文件了。

这不会减少样板文件但是至少将其移出我们核心业务逻辑之外：

```javascript
function FancyUserList(users) {
  return FancyBox(
    UserList.bind(null, users)
  );
} 
const box = FancyUserList(data.users);
const resolvedChildren = box.children(likesPerUser, updateUserLikes);
const resolvedBox = {
  ...box,
  children: resolvedChildren
};
```
> 延续是指高阶组件中绑定属性的延续？? 该例子核心逻辑是 likesPerUser, updateUserLikes? 那样板文件是userList.bind(null,user)??

##### 状态字典 StateMap #####

我们从前面可知，我们可以通过组合来避免重复实现一次又一次的相同的表达式当我们发现重复的表达式时。我们可以移动提取和传递状态的逻辑成为一个低一级的函数，这样我们就可以更加的重用。

```javascript
function FancyBoxWithState(
  children,
  stateMap,
  updateState
) {
  return FancyBox(
    children.map(child => child.continuation(
      stateMap.get(child.key),
      updateState
    ))
  );
}

function UserList(users) {
  return users.map(user => {
    continuation: FancyNameBox.bind(null, user),
    key: user.id
  });
}

function FancyUserList(users) {
  return FancyBoxWithState.bind(null,
    UserList(users)
  );
}

const continuation = FancyUserList(data.users);
continuation(likesPerUser, updateUserLikes);
```
##### 函数记忆字典 Memoization Map #####

这样我们想记忆在一个列表中多个条目变得更加困难，你必须想出复杂的缓存算法来平衡频繁的内存使用。

幸运的是，UI视图趋于在同一个位置保持相当稳定，在树中的同一个位置通常的值一样。此树对于函数记忆来说很有用。

我们可以使用相同的相同的追踪哪些用来追踪状态的并且通过组合函数来传递函数记忆缓存

```javascript
function memoize(fn) {
  return function(arg, memoizationCache) {
    if (memoizationCache.arg === arg) {
      return memoizationCache.result;
    }
    const result = fn(arg);
    memoizationCache.arg = arg;
    memoizationCache.result = result;
    return result;
  };
}

function FancyBoxWithState(
  children,
  stateMap,
  updateState,
  memoizationCache
) {
  return FancyBox(
    children.map(child => child.continuation(
      stateMap.get(child.key),
      updateState,
      memoizationCache.get(child.key)
    ))
  );
}

const MemoizedFancyNameBox = memoize(FancyNameBox);
```

##### 代数效应 Algebraic Effects #####

It turns out that it is kind of a PITA to pass every little value you might need through several levels of abstractions. It is kind of nice to sometimes have a shortcut to pass things between two abstractions without involving the intermediates. In React we call this "context".

Sometimes the data dependencies don't neatly follow the abstraction tree. For example, in layout algorithms you need to know something about the size of your children before you can completely fulfill their position.

Now, this example is a bit "out there". I'll use Algebraic Effects as proposed for ECMAScript. If you're familiar with functional programming, they're avoiding the intermediate ceremony imposed by monads.
```javascript
function ThemeBorderColorRequest() { }

function FancyBox(children) {
  const color = raise new ThemeBorderColorRequest();
  return {
    borderWidth: '1px',
    borderColor: color,
    children: children
  };
}

function BlueTheme(children) {
  return try {
    children();
  } catch effect ThemeBorderColorRequest -> [, continuation] {
    continuation('blue');
  }
}

function App(data) {
  return BlueTheme(
    FancyUserList.bind(null, data.users)
  );
}
```



















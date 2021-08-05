# umi project

## Getting Started
<script>
(function(){
    var now = new Date()
    var time = document.getElementById('time')
    time.innnerHTML(now)
})
</script>
<body>
<h1>test分支为测试环境分支</h1><br />

<h2>(当前提交为<span id='time'></span> 提交)</h2><br />

<h1>一般使用git方法如下</h1>

<li> ls .ssh (查看之前是否生成ssh密钥) </li>

<li> git 全局设置（提交者name/email） </li>

<li> git config --global user.name "你的昵称" </li>

<li> git config --global user.email "你的邮箱" </li>

<h2> 创建新的（本地）仓库 </h2>

<li> git clone 你的地址 </li>

<li> touch README.md </li>

<li> git add README.md </li>

<li> git commit -m 'add README' </li>

<li> git push -u origin main(主分支 master ——> main) </li>

<h2> push 一个已存在的文件夹 </h2>

<li> cd 文件夹 </li>

<li> git init (初始化) </li>

<li> git remote add origin 远程仓库地址 </li>

<li> git add . </li>

<li> git commit -m 'initial commit'  </li>

<li> git push -u origin main  </li>

<li> 上传一个已存在的 git 本地仓库 </li>

<li> cd 本地仓库地址 </li>

<li> git remote rename origin old-origin （移除旧有仓库）</li>

<li> git remote add origin 远程仓库地址 </li>

<li> git remote -v (查看当前 git 仓库地址) </li>

<li> git push -u origin --all </li>

<li> git push -u origin --tags </li>

<h2>提交步骤(简略)</h2>
<ol>
<li>git add .   (暂存到缓存区)</li>

<li>git commit -m '提交'  (提交分支)</li>

<li>git pull 拉取分支</li>

<li>（若存在冲突则先合并冲突，重复以上步骤）</li>

<li>git push --set-upstream origin test 将本地分支与远程分支链接(若原本已链接则跳过)</li>

<li>git push 推送本地分支到远程分支</li>

<li>git merge 分支名 (合并分支)</li>
</ol>

<h2>每当有新需求，须通过master分支拉取项目需求分支，提交保存后切换到test分支后合并原本分支后方可</h2><br />

启动项目：<h2>npm run start</h2>

打包项目：<h2>npm run build</h2>

</body>



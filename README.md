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



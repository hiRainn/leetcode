module.exports = {
	title: 'workbench',
	description: 'Just playing around',
	base: '/leetcode/',
	
	markdown: {
	  lineNumbers: true
	},
	themeConfig:{
		repo: 'hirainn/workbench',
		docsDir: 'docs',
		editLinks: false,
		editLinkText: '在 Github 上帮助我们编辑此页',
		lastUpdated: '上次更新时间',
		smoothScroll: true,
		sidebar:[
			{
			  title: '简介',
			  collapsable: false,
			  children: [
				  {title:'简介',path:'/project/reason'},
				  {title:'目标',path:'/project/goal'},
			  ]
			},
			{
			  title: '开始',
			  collapsable: false,
			  children: [
			    '/start/start', '/start/use'
			  ]
			},
			{
			  title: '个人版',
			  collapsable: false,
			  children: [
				 
			  ]
			},
			{
			  title: '协作版',
			  collapsable: false,
			  children: [
				 
			  ]
			},
		]
	}
}

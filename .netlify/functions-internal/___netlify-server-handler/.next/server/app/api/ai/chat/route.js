"use strict";(()=>{var e={};e.id=76,e.ids=[76],e.modules={2934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3685:e=>{e.exports=require("http")},5687:e=>{e.exports=require("https")},5477:e=>{e.exports=require("punycode")},2781:e=>{e.exports=require("stream")},7310:e=>{e.exports=require("url")},9796:e=>{e.exports=require("zlib")},3294:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>y,originalPathname:()=>w,patchFetch:()=>$,requestAsyncStorage:()=>m,routeModule:()=>h,serverHooks:()=>d,staticGenerationAsyncStorage:()=>l,staticGenerationBailout:()=>x});var a={};r.r(a),r.d(a,{POST:()=>p});var s=r(5419),o=r(9108),n=r(9678),i=r(8070),c=r(5009),u=r(2509);async function p(e){try{let t=await (0,u.e)(),{data:{user:r}}=await t.auth.getUser();if(!r)return i.Z.json({error:"未登录"},{status:401});let{message:a,history:s}=await e.json();if(!a)return i.Z.json({error:"消息不能为空"},{status:400});let o=await c.c.chatWithMentor(a,s||[]);return i.Z.json({success:!0,message:o})}catch(e){return console.error("AI聊天失败:",e),i.Z.json({error:e.message||"AI服务暂时不可用"},{status:500})}}let h=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/ai/chat/route",pathname:"/api/ai/chat",filename:"route",bundlePath:"app/api/ai/chat/route"},resolvedPagePath:"C:\\Users\\wangqiyuan\\project\\cursor\\aicodegame\\src\\app\\api\\ai\\chat\\route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:l,serverHooks:d,headerHooks:y,staticGenerationBailout:x}=h,w="/api/ai/chat/route";function $(){return(0,n.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:l})}},5009:(e,t,r)=>{r.d(t,{c:()=>s});class a{constructor(e=process.env.DEEPSEEK_API_KEY||"",t=process.env.DEEPSEEK_API_URL||"https://api.deepseek.com",r="deepseek-coder"){this.apiKey=e,this.baseURL=t,this.model=r}async chat(e,t){if(!this.apiKey)throw Error("DeepSeek API密钥未配置");try{let r=await fetch(`${this.baseURL}/v1/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.apiKey}`},body:JSON.stringify({model:this.model,messages:e,temperature:t?.temperature||.7,max_tokens:t?.maxTokens||2e3,stream:t?.stream||!1})});if(!r.ok){let e=await r.json();throw Error(`DeepSeek API错误: ${e.message||r.statusText}`)}let a=await r.json();return a.choices[0]?.message?.content||""}catch(e){throw console.error("DeepSeek API调用失败:",e),e}}async explainCode(e,t,r){let a=[{role:"system",content:"你是一个专业的编程教学助手。你的任务是用简单易懂的中文解释代码,适合编程初学者理解。"},{role:"user",content:`请详细解释以下${t}代码的作用:

\`\`\`${t}
${e}
\`\`\`${r?`

上下文: ${r}`:""}

请逐行解释,并说明整体功能。`}];return await this.chat(a,{temperature:.7,maxTokens:1500})}async gradeCode(e,t,r){let a=[{role:"system",content:"你是一个严格但友好的代码评审专家。请对学生的代码进行评分(0-100分)和反馈。"},{role:"user",content:`任务要求:
${r}

学生提交的${t}代码:
\`\`\`${t}
${e}
\`\`\`

请按以下格式评分:
1. 给出总分(0-100)
2. 评价功能完整性、代码规范性、性能优化
3. 提供具体改进建议`}],s=await this.chat(a,{temperature:.5,maxTokens:1e3}),o=s.match(/总分[：:]\s*(\d+)/i),n=o?parseInt(o[1]):70,i=[],c=s.match(/\d+\.\s*(.+?)(?=\n\d+\.|$)/g);return c&&i.push(...c.map(e=>e.trim())),{score:Math.min(100,Math.max(0,n)),feedback:s,suggestions:i}}async diagnoseError(e,t,r){let a=[{role:"system",content:"你是一个耐心的编程导师。帮助学生找出代码中的问题并提供修复方案。"},{role:"user",content:`请帮我诊断这段${t}代码的问题:

\`\`\`${t}
${e}
\`\`\`${r?`

错误信息: ${r}`:""}

请说明:
1. 问题是什么
2. 如何修复
3. 提供修复后的代码`}],s=await this.chat(a,{temperature:.5,maxTokens:1500}),o=s.match(/```(?:\w+)?\n([\s\S]+?)\n```/),n=o?o[1].trim():void 0,i=s.match(/问题.*?[:：]\s*(.+?)(?=\n|如何|$)/i),c=s.match(/修复.*?[:：]\s*(.+?)(?=\n|提供|$)/i);return{problem:i?i[1].trim():"代码可能存在逻辑或语法错误",solution:c?c[1].trim():"请检查代码语法和逻辑",fixedCode:n}}async generateHint(e,t,r){let a=[{role:"system",content:"你是一个编程学习助手。提供渐进式的提示,帮助学生自己完成任务,而不是直接给出答案。"},{role:"user",content:`任务: ${e}

学生当前的代码:
\`\`\`${r}
${t}
\`\`\`

请给出下一步提示（不要直接给出完整答案）。`}];return await this.chat(a,{temperature:.8,maxTokens:500})}async generateExercise(e,t,r){let a=[{role:"system",content:"你是一个编程教育专家,擅长设计编程练习题。"},{role:"user",content:`请为"${e}"主题生成一道${{easy:"简单",medium:"中等",hard:"困难"}[t]}难度的${r}练习题。

要求:
1. 标题
2. 详细描述
3. 初始代码
4. 参考答案
5. 3个渐进式提示`}],s=await this.chat(a,{temperature:.8,maxTokens:2e3}),o=s.match(/标题.*?[:：]\s*(.+?)(?=\n|$)/i);return{title:o?o[1].trim():`${e} 练习`,description:s,starterCode:`// ${e} 练习
// 在这里编写你的代码
`,solution:"",hints:["检查代码结构","注意边界情况","测试不同输入"]}}async chatWithMentor(e,t=[]){let r=[{role:"system",content:"你是 CodeMentor DS,一个友好、专业的编程导师。你的目标是帮助学生学习HTML、CSS和JavaScript。回答要简洁、准确、鼓励性,适合编程初学者。"},...t,{role:"user",content:e}];return await this.chat(r,{temperature:.9,maxTokens:1e3})}}let s=new a},2509:(e,t,r)=>{r.d(t,{e:()=>o});var a=r(763),s=r(7439);async function o(){try{let e="https://zzyueuweeoakopuuwfau.supabase.co",t="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eXVldXdlZW9ha29wdXV3ZmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODEzMDEsImV4cCI6MjA1OTk1NzMwMX0.y8V3EXK9QVd3txSWdE3gZrSs96Ao0nvpnd0ntZw_dQ4";if(!e||!t)throw Error("Supabase配置缺失");let r=await (0,s.cookies)();return(0,a.lx)(e,t,{cookies:{get:e=>r.get(e)?.value,set(e,t,a){try{r.set({name:e,value:t,...a})}catch(e){}},remove(e,t){try{r.set({name:e,value:"",...t})}catch(e){}}}})}catch(e){throw console.error("Supabase服务端客户端初始化失败:",e),e}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[225,24],()=>r(3294));module.exports=a})();
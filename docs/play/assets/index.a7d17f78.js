var t=Object.defineProperty,e=Object.defineProperties,n=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,c=Object.prototype.propertyIsEnumerable,a=(e,n,r)=>n in e?t(e,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[n]=r;const o=t=>{return axios.post("https://ff827abe-e27d-48d4-a09a-81355a2ce85d.bspapp.com/path/add",(o=((t,e)=>{for(var n in e||(e={}))i.call(e,n)&&a(t,n,e[n]);if(r)for(var n of r(e))c.call(e,n)&&a(t,n,e[n]);return t})({},t),s={createTime:Date.now()},e(o,n(s))));var o,s},s=document.querySelector("#canvas");s.width=innerWidth,s.height=innerHeight;const d=s.getContext("2d"),h=new class{constructor(t){this.ctx=t,this.ctx.fillStyle="#fff",this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.ctx.lineWidth=6,this.ctx.lineCap="round",this.ctx.lineJoin="round"}drawLine(t,e){return this.restarting&&(this.restarting=!1,this.ctx.moveTo(t,e),this.ctx.beginPath()),this.ctx.lineTo(t,e),this.ctx.stroke(),this}end(){return this.restarting=!0,this.ctx.closePath(),this}}(d);let l=[],u=[],p=!1,f=!0;s.addEventListener("touchstart",(function(t){if(f)return;p=!0;const{clientX:e,clientY:n}=t.touches[0];u=[{x:e,y:n}],h.drawLine(e,n)})),s.addEventListener("touchmove",(function(t){if(p){const{clientX:e,clientY:n}=t.touches[0];u.push({x:e,y:n}),h.drawLine(e,n)}})),s.addEventListener("touchend",(function(t){p=!1,l.push(u),u=[],h.end()}));let y=!1;document.querySelector("#save").addEventListener("click",(function(t){document.querySelector(".tui-dialog").style.display="flex",y=!0}),!1),document.querySelector("#clear").addEventListener("click",(function(t){f=!1,d.clearRect(0,0,s.width,s.height)}),!1),document.querySelector("#passwordConfirm").addEventListener("click",(function(t){document.querySelector(".tui-dialog").style.display="none";const e=document.querySelector("#passwordInput").value;var n;y?o({password:e,path:l}):(n={password:e},axios.get("https://ff827abe-e27d-48d4-a09a-81355a2ce85d.bspapp.com/path/get",{params:n}).then((t=>{if(200===t.status)return t.data;throw new Error(t)}))).then((({data:t})=>{t.length&&function(t){let e=0,n=0;const r=({x:t,y:e})=>{h.drawLine(t,e),requestAnimationFrame(i)},i=()=>{if(n>=t[e].length){if(h.end(),!(++e<t.length))return;n=0,setTimeout((()=>{r(t[e][n++])}),240)}else r(t[e][n++])};requestAnimationFrame(i)}(t[0].path)}))}),!1);
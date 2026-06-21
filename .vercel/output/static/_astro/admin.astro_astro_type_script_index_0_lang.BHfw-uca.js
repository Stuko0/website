import{i as o,a as d,p as s}from"./pocketbase._TcM0L3l.js";const c=document.getElementById("admin-content"),i=document.getElementById("no-access");!o()||!d()?(c.classList.add("hidden"),i.classList.remove("hidden")):a();async function a(){try{const t=await s.collection("products").getList(1,1);document.getElementById("stat-products").textContent=t.totalItems.toString()}catch{}try{const t=await s.collection("orders").getList(1,5,{sort:"-created"});document.getElementById("stat-orders").textContent=t.totalItems.toString();const n=document.getElementById("recent-orders");t.items.length===0?n.innerHTML='<p class="text-muted text-sm">No hay pedidos aún</p>':n.innerHTML=t.items.map(e=>`
            <div class="flex items-center justify-between p-3 border border-border rounded">
              <div>
                <p class="font-semibold text-heading">Pedido #${e.id.slice(0,8)}</p>
                <p class="text-sm text-muted">${e.status||"pending"}</p>
              </div>
              <p class="font-bold text-primary">Bs ${e.total?.toFixed(2)||"0.00"}</p>
            </div>
          `).join("")}catch{document.getElementById("recent-orders").innerHTML='<p class="text-muted text-sm">No hay pedidos aún</p>'}try{const t=await s.collection("users").getList(1,1);document.getElementById("stat-users").textContent=t.totalItems.toString()}catch{}}

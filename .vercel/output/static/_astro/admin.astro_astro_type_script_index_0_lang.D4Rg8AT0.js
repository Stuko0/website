import{i as d,a as o,f as s}from"./api.B5AQRKDE.js";const a=document.getElementById("admin-content"),i=document.getElementById("no-access");!d()||!o()?(a.classList.add("hidden"),i.classList.remove("hidden")):c();async function c(){try{const t=await s("/api/products");document.getElementById("stat-products").textContent=Array.isArray(t)?t.length.toString():"0"}catch{}try{const t=await s("/api/orders");document.getElementById("stat-orders").textContent=Array.isArray(t)?t.length.toString():"0";const e=document.getElementById("recent-orders");!t||t.length===0?e.innerHTML='<p class="text-muted text-sm">No hay pedidos aún</p>':e.innerHTML=t.map(n=>`
            <div class="flex items-center justify-between p-3 border border-border rounded">
              <div>
                <p class="font-semibold text-heading">Pedido #${(n.id||"").slice(0,8)}</p>
                <p class="text-sm text-muted">${n.status||"pending"}</p>
              </div>
              <p class="font-bold text-primary">Bs ${(n.total||0).toFixed(2)}</p>
            </div>
          `).join("")}catch{document.getElementById("recent-orders").innerHTML='<p class="text-muted text-sm">No hay pedidos aún</p>'}try{const t=await fetch("/api/users/count");if(t.ok){const e=await t.json();document.getElementById("stat-users").textContent=e.count?.toString()||"0"}}catch{}}

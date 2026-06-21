import{u as l,r as u,a as m,b as p}from"./cart.cldTfP-c.js";function n(){const e=m(),o=document.getElementById("cart-items-container"),r=document.getElementById("cart-with-items"),s=document.getElementById("cart-empty"),a=document.getElementById("cart-subtotal"),c=document.getElementById("cart-total");if(e.length===0){r.classList.add("hidden"),s.classList.remove("hidden");return}r.classList.remove("hidden"),s.classList.add("hidden"),o.innerHTML=e.map(t=>`
        <div class="grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_auto] gap-4 items-center py-4 border-b border-border" data-item-id="${t.id}">
          <div class="flex items-center gap-4">
            <img src="${t.image||"/placeholder-product.jpg"}" alt="${t.name}" class="w-20 h-20 object-cover rounded" />
            <div>
              <a href="/productos/${t.slug||t.id}" class="font-semibold text-primary hover:text-accent transition-colors">${t.name}</a>
              <button onclick="window.removeItem('${t.id}')" class="block text-sm text-muted hover:text-red-500 mt-1 transition-colors">
                Eliminar
              </button>
            </div>
          </div>
          <p class="text-center text-muted md:mt-0">Bs ${t.price.toFixed(2)}</p>
          <div class="flex justify-center">
            <div class="flex items-center border-2 border-border rounded w-fit">
              <button onclick="window.updateQty('${t.id}', ${t.quantity-1})" class="px-3 py-1 hover:bg-accent/20 transition-colors">-</button>
              <span class="px-3 py-1 border-x-2 border-border">${t.quantity}</span>
              <button onclick="window.updateQty('${t.id}', ${t.quantity+1})" class="px-3 py-1 hover:bg-accent/20 transition-colors">+</button>
            </div>
          </div>
          <p class="text-right font-semibold">Bs ${(t.price*t.quantity).toFixed(2)}</p>
        </div>
      `).join("");const d=p(),i=d+15;a.textContent=`Bs ${d.toFixed(2)}`,c.textContent=`Bs ${i.toFixed(2)}`}window.updateQty=(e,o)=>{l(e,o),n()};window.removeItem=e=>{u(e),n()};n();

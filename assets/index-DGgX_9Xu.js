(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();const v="1K9IXxplxKbjXlGNGjSZKtUzMP-Jj5GJqUE7FGXe9z-k",b=`https://docs.google.com/spreadsheets/d/${v}/export?format=csv&gid=0`;let c=null;const y={tenor1:"1º Tenor",tenor2:"2º Tenor",baritone:"Barítono",bass:"Baixo"};document.addEventListener("DOMContentLoaded",()=>{L(),document.getElementById("search-input").addEventListener("input",e=>A(e.target.value.trim()))});async function L(){try{const e=await fetch(b);if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.text(),r=$(t);f(r),B(r)}catch(e){console.error("Falha ao carregar planilha:",e),C()}}function $(e){const t=e.split(`
`).filter(n=>n.trim()!=="");if(t.length<2)return[];const r=u(t[0]),s=[];for(let n=1;n<t.length;n++){const o=u(t[n]);if(o.every(d=>d.trim()===""))continue;const i={};r.forEach((d,h)=>{i[d.trim()]=(o[h]??"").trim()}),s.push(i)}return s.map(E).filter(n=>n.title!=="")}function u(e){const t=[];let r="",s=!1;for(let n=0;n<e.length;n++){const o=e[n];o==='"'?s&&e[n+1]==='"'?(r+='"',n++):s=!s:o===","&&!s?(t.push(r),r=""):r+=o}return t.push(r),t}function E(e){const t=(e.scores_labels??"").split("|").map(o=>o.trim()).filter(Boolean),r=(e.scores_urls??"").split("|").map(o=>o.trim()).filter(Boolean),s=t.map((o,i)=>({label:o,url:r[i]??""})).filter(o=>o.url!==""),n={};return e.tenor1&&(n.tenor1=l(e.tenor1)),e.tenor2&&(n.tenor2=l(e.tenor2)),e.baritone&&(n.baritone=l(e.baritone)),e.bass&&(n.bass=l(e.bass)),{id:S(e.title??""),title:e.title??"",scores:s,voiceKits:n}}function l(e){try{const t=new URL(e);if(t.searchParams.get("v"))return t.searchParams.get("v");if(t.hostname==="youtu.be")return t.pathname.slice(1);const r=t.pathname.match(/\/embed\/([^/?]+)/);if(r)return r[1]}catch{}return e}function S(e){return e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function B(e){document.getElementById("song-list").dataset.songs=JSON.stringify(e)}function C(){document.getElementById("error-message").hidden=!1}function f(e){const t=document.getElementById("song-list");if(t.innerHTML="",e.length===0){t.innerHTML='<p style="text-align:center;color:var(--text-muted);padding:24px">Nenhuma música encontrada.</p>';return}e.forEach(r=>t.appendChild(O(r)))}function O(e){const t=e.scores?.length??0,r=Object.keys(e.voiceKits??{}).length,s=[];t>0&&s.push(`${t} partitura${t>1?"s":""}`),r>0&&s.push(`${r} kit${r>1?"s":""} de voz`);const n=document.createElement("div");return n.className="song-card",n.id=`song-${e.id}`,n.setAttribute("role","listitem"),n.dataset.title=e.title.toLowerCase(),n.innerHTML=`
    <button class="song-toggle" aria-expanded="false" aria-controls="body-${e.id}">
      <span class="song-toggle-left">
        <span class="song-icon">🎵</span>
        <span>
          <span class="song-title">${p(e.title)}</span>
          <span class="song-meta">${s.join(" · ")||"Sem conteúdo"}</span>
        </span>
      </span>
      <svg class="song-chevron" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div class="song-body" id="body-${e.id}" hidden>
      ${w(e.scores)}
      ${x(e.id,e.voiceKits)}
    </div>
  `,n.querySelector(".song-toggle").addEventListener("click",()=>T(e.id)),n}function w(e){return!e||e.length===0?"":`
    <div class="scores-section">
      <div class="section-label">Partituras</div>
      <div class="score-chips">${e.map(r=>`<a class="score-chip" href="${a(r.url)}" target="_blank" rel="noopener">📄 ${p(r.label)}</a>`).join("")}</div>
    </div>
  `}function x(e,t){return!t||Object.keys(t).length===0?"":`
    <div class="voice-kit-section">
      <div class="section-label">Kit de Voz</div>
      <div class="voice-buttons">${Object.entries(t).map(([s,n])=>`<button class="voice-btn" data-song="${a(e)}" data-voice="${a(s)}" data-video="${a(n)}">
      ▶ ${y[s]??s}
    </button>`).join("")}</div>
      <div class="player-container" id="player-${a(e)}"></div>
    </div>
  `}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function a(e){return String(e).replace(/"/g,"&quot;")}function T(e){const t=c===e;c!==null&&m(c),t?c=null:(I(e),c=e)}function I(e){const t=document.getElementById(`song-${e}`);if(!t)return;const r=document.getElementById(`body-${e}`),s=t.querySelector(".song-toggle");t.classList.add("is-open"),r.hidden=!1,s.setAttribute("aria-expanded","true"),r.addEventListener("click",g)}function m(e){const t=document.getElementById(`song-${e}`),r=document.getElementById(`body-${e}`),s=t?.querySelector(".song-toggle");t&&(t.classList.remove("is-open"),r.hidden=!0,s.setAttribute("aria-expanded","false"),j(e),r.removeEventListener("click",g))}function g(e){const t=e.target.closest(".voice-btn");if(!t)return;const r=t.dataset.song,s=t.dataset.video;document.querySelectorAll(`#body-${r} .voice-btn`).forEach(o=>o.classList.remove("is-active")),t.classList.add("is-active"),P(r,s)}function P(e,t){const r=document.getElementById(`player-${e}`);r&&(r.classList.add("is-visible"),r.innerHTML=`
    <iframe
      src="https://www.youtube.com/embed/${a(t)}?rel=0"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `)}function j(e){const t=document.getElementById(`player-${e}`);t&&(t.classList.remove("is-visible"),t.innerHTML="",document.querySelectorAll(`#body-${e} .voice-btn`).forEach(r=>r.classList.remove("is-active")))}function A(e){const t=document.getElementById("song-list").dataset.songs;if(!t)return;const r=JSON.parse(t),s=e.toLowerCase(),n=s?r.filter(o=>o.title.toLowerCase().includes(s)):r;c!==null&&(m(c),c=null),f(n)}

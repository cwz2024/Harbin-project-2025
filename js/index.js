import { map } from "./map.js";
import { pathPointIcon } from "./icon.js";
import { pathPoints } from "./pathPoints.js";

function setMapHeight() {
    let map = document.getElementById('map');
    map.style.height = window.innerHeight + 'px';
}

setMapHeight();

window.addEventListener('resize', setMapHeight);
window.addEventListener('orientationchange', setMapHeight);

map.setView([INITIAL_LAT, INITIAL_LNG], DEFAULT_ZOOM);

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 根据设备类型决定是否显示经纬度
document.getElementById('coordinate-display').style.display = isMobile() ? 'none' : 'block';

pathPoints.forEach(function (point) {
    let marker = L.marker([point.lat, point.lng], { icon: pathPointIcon }).addTo(map);
    let popupContent = `
            <b>${point.title}</b><br>
            <img src="${point.image}" alt="${point.title}" style="width:100%;"><br>
            <p class=\"site-intro\">${point.content || '这是' + point.title}</p><br>
        `;
    marker.bindPopup(popupContent, {
        maxWidth: Math.min(300, window.innerWidth - 100),
        maxHeight: window.innerHeight - 200
    }).openPopup().closePopup();
    marker.on('click', function () {
        map.setView([point.lat, point.lng], map.getZoom(), {
            animate: true,
            duration: 0.5
        });

        marker.openPopup();
    });
});

map.setView([INITIAL_LAT, INITIAL_LNG], 5);

let nav = document.querySelector('#location-nav')

let province = []
for (let i = 0; i < pathPoints.length; i++) {
    if (!province.includes(pathPoints[i].location)) {
        province.push(pathPoints[i].location)
    }
}
province.sort((a, b) => a.localeCompare(b))
updateSidebar(pathPoints.filter(point => point.location === province[0]));
console.log(province)
nav.innerHTML = province.map(p => `
    <option value="${p}">${p}</option>
`).join('');

nav.onchange = function () {
    updateSidebar(pathPoints.filter(point => point.location === this.value))
}

function updateSidebar(points) {
    let sidebarList = document.getElementById('sidebar-list');
    sidebarList.innerHTML = points.map(point => `
        <li data-lat="${point.lat}" data-lng="${point.lng}">
            ${point.title}
        </li>
    `).join('');

    sidebarList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', function () {
            let lat = parseFloat(this.getAttribute('data-lat'));
            let lng = parseFloat(this.getAttribute('data-lng'));
            map.closePopup();
            map.setView([lat, lng], DEFAULT_ZOOM);
        });
    });
}

document.getElementById('sidebar-toggle').addEventListener('click', function () {
    let sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
});


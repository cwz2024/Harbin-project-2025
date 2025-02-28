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
            ${point.content ?? '这是' + point.title}<br>
        `;
    marker.bindPopup(popupContent, {
        maxWidth: Math.min(300, window.innerWidth - 100),
        maxHeight: window.innerHeight - 150
    }).openPopup().closePopup();
    marker.on('click', function () {
        map.setView([point.lat, point.lng], map.getZoom(), {
            animate: true,
            duration: 0.5
        });

        marker.openPopup();
    });
});

map.setView([INITIAL_LAT, INITIAL_LNG], DEFAULT_ZOOM);

updateSidebar(pathPoints.filter(point => point.location === '哈尔滨'));
document.querySelector('#location-nav button').classList.add('active');

document.querySelectorAll('#location-nav button').forEach(button => {
    button.addEventListener('click', function () {
        let location = this.getAttribute('data-location');
        let filteredPoints = pathPoints.filter(point => point.location === location);

        updateSidebar(filteredPoints);

        document.querySelectorAll('#location-nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
    });
});

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


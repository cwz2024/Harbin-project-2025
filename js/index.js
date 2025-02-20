import { map } from "./map.js";
import { pathPointIcon } from "./icon.js";
import { pathPoints } from "./pathPoints.js";

// 动态调整地图高度
function setMapHeight() {
    let map = document.getElementById('map');
    map.style.height = window.innerHeight + 'px';
}

setMapHeight();

window.addEventListener('resize', setMapHeight);
window.addEventListener('orientationchange', setMapHeight);

map.setView([INITIAL_LAT, INITIAL_LNG], DEFAULT_ZOOM);

let userLat = INITIAL_LAT;
let userLng = INITIAL_LNG;

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 根据设备类型决定是否显示经纬度
document.getElementById('coordinate-display').style.display = isMobile() ? 'none' : 'block';

// 初始化显示所有路径点
pathPoints.forEach(function (point) {
    let marker = L.marker([point.lat, point.lng], { icon: pathPointIcon }).addTo(map);
    let popupContent = `
            <b>${point.title}</b><br>
            <img src="${point.image}" alt="${point.title}" style="width:100%;"><br>
            ${point.content ?? '这是' + point.title}<br>
        `;
    marker.bindPopup(popupContent);
    marker.on('click', function () {
        marker.openPopup();
    });
});

// 显示哈尔滨的路径点

updateSidebar(pathPoints.filter(point => point.location === '哈尔滨'));
document.querySelector('#location-nav button').classList.add('active');

// 导航栏按钮点击事件
document.querySelectorAll('#location-nav button').forEach(button => {
    button.addEventListener('click', function () {
        let location = this.getAttribute('data-location');
        let filteredPoints = pathPoints.filter(point => point.location === location);

        // 更新侧边栏
        updateSidebar(filteredPoints);

        // 设置按钮的激活状态
        document.querySelectorAll('#location-nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// 更新侧边栏的函数
function updateSidebar(points) {
    // 更新侧边栏中的路径点
    let sidebarList = document.getElementById('sidebar-list');
    sidebarList.innerHTML = points.map(point => `
        <li data-lat="${point.lat}" data-lng="${point.lng}">
            ${point.title}
        </li>
    `).join('');

    // 点击侧边栏中的路径点时，定位到该路径点
    sidebarList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', function () {
            let lat = parseFloat(this.getAttribute('data-lat'));
            let lng = parseFloat(this.getAttribute('data-lng'));
            map.setView([lat, lng], DEFAULT_ZOOM); // 定位到路径点
        });
    });
}

// 侧边栏展开/收起功能
document.getElementById('sidebar-toggle').addEventListener('click', function () {
    let sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
});


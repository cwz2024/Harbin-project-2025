import { locateControler } from "./locateControl.js";

// 初始化地图
const map = L.map('map');

// 添加地图图层（高德地图）
L.tileLayer('https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    attribution: '地图数据 &copy; <a href="https://www.amap.com/">高德地图</a>',
    coordType: 'gcj02'
}).addTo(map);

// 添加定位按钮到地图
map.zoomControl.setPosition('bottomright');
map.addControl(locateControler);

document.querySelector('.leaflet-control-zoom-in').title = '放大';
document.querySelector('.leaflet-control-zoom-out').title = '缩小';


map.on('mousemove', function (e) {
    // 获取鼠标位置的经纬度
    let lat = (e.latlng.lat).toFixed(6);
    let lng = (e.latlng.lng).toFixed(6);

    // 更新显示经纬度的内容
    document.getElementById('coordinates').textContent = lat + ', ' + lng;
});

// 当鼠标移出地图时，清空显示
map.on('mouseout', function () {
    document.getElementById('coordinates').textContent = '-';
});

export { map }
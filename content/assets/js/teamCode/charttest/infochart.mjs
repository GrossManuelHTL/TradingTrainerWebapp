import {getYearsRange, getTodayStock} from "../API/apidata.mjs";

if ($('#price').length) {
    let range = await getYearsRange(window.location.search.split("=")[1]);

    var chart = AmCharts.makeChart("price", {
        "type": "serial",
        "theme": "light",
        "marginRight": 20,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": range,
        "valueAxes": [{
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left"
        }],
        "mouseWheelZoomEnabled": true,
        "graphs": [{
            "id": "g1",
            "balloonText": "[[value]]",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "red line",
            "valueField": "data",
            "useLineColorForBulletBorder": true,
            "balloon": {
                "drop": true
            }
        }],
        "chartScrollbar": {
            "autoGridCount": true,
            "graph": "g1",
            "scrollbarHeight": 40,
            "color": "#fff",
            "selectedBackgroundAlpha": 1,
            "selectedBackgroundColor": "#815BF6",
            "selectedGraphFillAlpha": 0,
            "selectedGraphFillColor": "#8918FE",
            "graphLineAlpha": 0.2,
            "graphLineColor": "#c2c2c2",
            "selectedGraphLineColor": "#fff",
            "selectedGraphLineAlpha": 1
        },
        "chartCursor": {
            "limitToGraph": "g1"
        },
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "axisColor": "#DADADA",
            "dashLength": 1,
            "minorGridEnabled": true
        },
        "export": {
            "enabled": false
        }
    });
}

if ($('#today').length) {
    let [str, stocks] = await getTodayStock(window.location.search.split("=")[1]);

    let min = Math.min(...stocks) - 0.5;
    let max = Math.max(...stocks) + 0.5;

    if (str) {
        let tod = document.getElementById('today');
        tod.style.width = "100%";
        tod.style.height = "400px";

        var myConfig = {
            "type": "line",

            "scale-x": { //X-Axis
                "labels": str,
                "label": {
                    "font-size": 14,
                    "offset-x": 0,
                },
                "item": { //Scale Items (scale values or labels)
                    "font-size": 10,
                },
                "guide": { //Guides
                    "visible": false,
                    "line-style": "solid", //"solid", "dotted", "dashed", "dashdot"
                    "alpha": 1
                }
            },
            "scale-y": {
                "min-value": min, // Mindestwert der Y-Achse
                "max-value": max,
                "zooming": true
            },
            "plot": { "aspect": "spline" },
            "series": [{
                "values": stocks,
                "line-color": "#F0B41A",
                /* "dotted" | "dashed" */
                "line-width": 5 /* in pixels */ ,
                "marker": { /* Marker object */
                    "background-color": "#D79D3B",
                    /* hexadecimal or RGB value */
                    "size": 5,
                    /* in pixels */
                    "border-color": "#D79D3B",
                    /* hexadecimal or RBG value */
                }
            }]
        };

        zingchart.render({
            id: 'today',
            data: myConfig,
            height: "100%",
            width: "100%"
        });
    }


}

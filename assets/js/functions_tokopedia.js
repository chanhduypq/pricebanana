function getSeriesData(key) {
    var prices = [];
    if (key != '') {
        data = item_type_history[key];
        for (i = 0; i < data.length; i++) {

            date = new Date(data[i]['date']).getTime();
            date = parseFloat(date);
            price = parseFloat(data[i]['price']);
            prices.push([date, price]);

        }
    }

    seriesData = [{
            name: 'Price',
            data: prices,
            tooltip: {
                valueDecimals: 0,
                pointFormat: '{series.name}: <b>Rp {point.y}</b><br/>',
                shared: true,
                xDateFormat: '%b %e %Y'
            },
            color: 'blue'
        }
    ];

    return seriesData;
}
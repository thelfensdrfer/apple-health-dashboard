import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-luxon';

Chart.register(zoomPlugin);

async function getAllUrls(urls) {
    try {
        var data = await Promise.all(
            urls.map(
                url =>
                    fetch(url).then(
                        (response) => response.json()
                    )));

        return (data)

    } catch (error) {
        console.log(error)

        throw (error)
    }
}

(async function () {
    console.info('Loading data...')

    const responses = await getAllUrls([
        '/data.json',
        '/stats.json',
        '/hist.json',
    ])

    console.info('Data loaded, creating chart...')

    new Chart(document.querySelector('#chart-line'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Heart Rate',
                data: responses[0],
                fill: false,
                pointBackgroundColor: function (context) {
                    const value = context.dataset.data[context.dataIndex]

                    if (value.y < responses[1]['quantile_range']['start'] || value.y > responses[1]['quantile_range']['end']) {
                        return '#000000'
                    }

                    return (value.y < 60 || value.y > 100) ? '#b91c1c' : '#047857'
                },
            }]
        },
        options: {
            parsing: false,
            scales: {
                x: {
                    type: 'time',
                }
            }
        }
    });

    new Chart(document.querySelector('#chart-hist-default'), {
        type: 'bar',
        data: {
            labels: responses[2]['default']['bucket'],
            datasets: [{
                label: 'Heart Rate Histogram',
                data: responses[2]['default']['count']
            }]
        }
    });

    new Chart(document.querySelector('#chart-hist-sqrt'), {
        type: 'bar',
        data: {
            labels: responses[2]['sqrt']['bucket'],
            datasets: [{
                label: 'Heart Rate Histogram',
                data: responses[2]['sqrt']['count']
            }]
        }
    });

    new Chart(document.querySelector('#chart-hist-log'), {
        type: 'bar',
        data: {
            labels: responses[2]['log']['bucket'],
            datasets: [{
                label: 'Heart Rate Histogram',
                data: responses[2]['log']['count']
            }]
        }
    });

    document.querySelector('#stats-mean').textContent = responses[1]['mean']
    document.querySelector('#stats-median').textContent = responses[1]['median']
    document.querySelector('#stats-q-95').textContent = responses[1]['quantile_95']
    document.querySelector('#stats-q-99').textContent = responses[1]['quantile_99']
    document.querySelector('#stats-q-range').textContent = `${responses[1]['quantile_range']['start']} - ${responses[1]['quantile_range']['end']}`

    console.info('Chart created.')
})()

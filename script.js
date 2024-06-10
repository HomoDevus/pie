const COLORS = ['#EB5757', '#F2994A', '#6FCF97', '#9B51E0', '#2F80ED', '#56CCF2', '#219653', '#F2C94C']
const MAX_SECTORS = COLORS.length

handleDonutClick()


function handleDonutClick() {
    createDonutChart(getRandomDataForChart());
}

function getRandomDataForChart() {
    const amountOfSections = getRandomNumberInRange(1, MAX_SECTORS)
    const data = []

    for (let i = 0; i < amountOfSections; i++) {
        data.push({ value: getRandomNumberInRange(1, 10), radiusScale: 1 - i * 0.1 })
    }

    return data
}

function getRandomNumberInRange(a, b) {
    if (a > b) {
        throw new Error("The lower bound (a) must be less than or equal to the upper bound (b)");
    }

    return Math.floor(Math.random() * (b - a + 1)) + a;
}

function getRandomItems(array, n) {
    const shuffledArray = array.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    const selectedItems = shuffledArray.slice(0, n);

    return selectedItems;
}

function createDonutChart(data) {
    const svg = document.getElementById("donut-chart");
    const centerX = svg.width.baseVal.value / 2;
    const centerY = svg.height.baseVal.value / 2;
    const baseRadius = Math.min(centerX, centerY);
    const innerRadius = baseRadius / 6;
    const randomCoolors = getRandomItems(COLORS, data.length)

    let totalValue = 0;
    data.forEach(({ value }) => (totalValue += value));

    let startAngle = -90;
    let endAngle = -90;

    svg.innerHTML = ''

    data.forEach(({ value, radiusScale }, index) => {
        const radius = Math.round(baseRadius * radiusScale)
        const color = randomCoolors[index]

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        if (data.length === 1) {
            // If there is one section just draw one complete donut
            path.setAttribute("d", `M ${centerX} ${centerY - radius}` +
                ` A ${radius} ${radius} 0 1 1 ${centerX - 0.1} ${centerY - radius}` +
                ` L ${centerX - 0.1} ${centerY - innerRadius}` +
                ` A ${innerRadius} ${innerRadius} 0 1 0 ${centerX} ${centerY - innerRadius} Z`);
        } else {
            endAngle = startAngle + (360 * value) / totalValue;

            // Start and end of outer radian
            const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);

            const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

            // Start and end of inner radian
            const innerStartX = centerX + innerRadius * Math.cos((endAngle * Math.PI) / 180);
            const innerStartY = centerY + innerRadius * Math.sin((endAngle * Math.PI) / 180);

            const innerEndX = centerX + innerRadius * Math.cos((startAngle * Math.PI) / 180);
            const innerEndY = centerY + innerRadius * Math.sin((startAngle * Math.PI) / 180);

            // If section takes more than half of chart set flag to 1 otherwise to 0
            const largeArcFlag = value / totalValue <= 0.5 ? 0 : 1;

            path.setAttribute(
                "d",
                `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}` +
                ` L ${innerStartX} ${innerStartY} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEndX} ${innerEndY} Z`
            );
        }

        path.setAttribute("fill", color);
        path.setAttribute("opacity", "0.8");

        svg.appendChild(path);

        startAngle = endAngle;
    });
}

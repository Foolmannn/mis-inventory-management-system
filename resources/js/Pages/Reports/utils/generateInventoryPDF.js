
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "svg2pdf.js";

const COLORS = {
    primary: "#0F766E",
    green: "#16A34A",
    yellow: "#D97706",
    red: "#DC2626",
    blue: "#2563EB",
    purple: "#7C3AED",
    gray: "#64748B",
    light: "#F1F5F9",
    dark: "#1E293B",
};

const formatNPR = (value) => {
    const number = Number(value || 0);

    return `NPR ${number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const formatNumber = (value) =>
    Number(value || 0).toLocaleString("en-IN");

const escapeXml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

const getDonutSvg = (items, centerLabel, centerValue) => {
    const width = 360;
    const height = 240;
    const cx = 105;
    const cy = 112;
    const outerRadius = 72;
    const innerRadius = 43;

    const colors = [
        COLORS.green,
        COLORS.yellow,
        COLORS.red,
        COLORS.blue,
        COLORS.purple,
        COLORS.gray,
    ];

    const validItems = items.filter((item) => Number(item.value) > 0);
    const total = validItems.reduce(
        (sum, item) => sum + Number(item.value),
        0
    );

    let currentAngle = -90;

    const paths = validItems.map((item, index) => {
        const value = Number(item.value);
        const angle = (value / total) * 360;

        const start = currentAngle;
        const end = currentAngle + angle;

        const toPoint = (radius, degrees) => {
            const radians = (degrees * Math.PI) / 180;

            return {
                x: cx + radius * Math.cos(radians),
                y: cy + radius * Math.sin(radians),
            };
        };

        const outerStart = toPoint(outerRadius, start);
        const outerEnd = toPoint(outerRadius, end);
        const innerEnd = toPoint(innerRadius, end);
        const innerStart = toPoint(innerRadius, start);

        const largeArc = angle > 180 ? 1 : 0;

        const path = `
            M ${outerStart.x} ${outerStart.y}
            A ${outerRadius} ${outerRadius} 0 ${largeArc} 1
              ${outerEnd.x} ${outerEnd.y}
            L ${innerEnd.x} ${innerEnd.y}
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0
              ${innerStart.x} ${innerStart.y}
            Z
        `;

        currentAngle = end;

        return `<path d="${path}" fill="${colors[index % colors.length]}" />`;
    });

    const legend = validItems.map((item, index) => {
        const y = 48 + index * 29;
        const percentage = total
            ? ((Number(item.value) / total) * 100).toFixed(1)
            : "0.0";

        return `
            <rect x="205" y="${y - 11}" width="11" height="11"
                rx="2" fill="${colors[index % colors.length]}" />
            <text x="224" y="${y}" font-size="12" fill="${COLORS.dark}">
                ${escapeXml(item.name)}
            </text>
            <text x="224" y="${y + 14}" font-size="10" fill="${COLORS.gray}">
                ${formatNumber(item.value)} (${percentage}%)
            </text>
        `;
    });

    return `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="${width}" height="${height}"
             viewBox="0 0 ${width} ${height}">
            <rect width="100%" height="100%" fill="white" />
            ${paths.join("")}
            <circle cx="${cx}" cy="${cy}" r="${innerRadius - 1}"
                fill="white" />
            <text x="${cx}" y="${cy - 5}" text-anchor="middle"
                font-size="17" font-weight="bold" fill="${COLORS.dark}">
                ${escapeXml(centerValue)}
            </text>
            <text x="${cx}" y="${cy + 15}" text-anchor="middle"
                font-size="10" fill="${COLORS.gray}">
                ${escapeXml(centerLabel)}
            </text>
            ${legend.join("")}
        </svg>
    `;
};

const getBarChartSvg = (items, valueFormatter = formatNPR) => {
    const width = 440;
    const rowHeight = 30;
    const height = Math.max(90, items.length * rowHeight + 25);
    const labelWidth = 145;
    const barWidth = 190;
    const maxValue = Math.max(
        ...items.map((item) => Number(item.value || 0)),
        1
    );

    const rows = items.map((item, index) => {
        const y = 18 + index * rowHeight;
        const value = Number(item.value || 0);
        const widthValue = (value / maxValue) * barWidth;

        return `
            <text x="0" y="${y + 13}" font-size="11"
                fill="${COLORS.dark}">
                ${escapeXml(
                    String(item.name).length > 20
                        ? String(item.name).slice(0, 18) + "..."
                        : item.name
                )}
            </text>
            <rect x="${labelWidth}" y="${y}" width="${barWidth}"
                height="15" rx="4" fill="${COLORS.light}" />
            <rect x="${labelWidth}" y="${y}" width="${widthValue}"
                height="15" rx="4" fill="${COLORS.primary}" />
            <text x="${labelWidth + barWidth + 9}" y="${y + 12}"
                font-size="10" fill="${COLORS.gray}">
                ${escapeXml(valueFormatter(value))}
            </text>
        `;
    });

    return `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="${width}" height="${height}"
             viewBox="0 0 ${width} ${height}">
            <rect width="100%" height="100%" fill="white" />
            ${rows.join("")}
        </svg>
    `;
};

const addSvgToPDF = async (doc, svgMarkup, x, y, width, height) => {
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(
        svgMarkup,
        "image/svg+xml"
    );

    const svgElement = svgDocument.documentElement;

    await doc.svg(svgElement, {
        x,
        y,
        width,
        height,
    });
};

const addSectionTitle = (doc, title, x, y) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(COLORS.dark);
    doc.text(title, x, y);

    doc.setDrawColor(226, 232, 240);
    doc.line(x, y + 3, 283, y + 3);
};

const addSummaryCards = (doc, stats) => {
    const cards = [
        ["Total Products", stats.total_products, COLORS.blue],
        ["Total Stock", stats.total_stock, COLORS.primary],
        ["In Stock", stats.in_stock_count, COLORS.green],
        ["Low Stock", stats.low_stock_count, COLORS.yellow],
        ["Out of Stock", stats.out_of_stock_count, COLORS.red],
        ["Inventory Value", formatNPR(stats.inventory_value), COLORS.blue],
        [
            "Potential Sales",
            formatNPR(stats.potential_selling_value),
            COLORS.purple,
        ],
        [
            "Potential Profit",
            formatNPR(stats.potential_profit),
            COLORS.green,
        ],
    ];

    const startX = 14;
    const cardWidth = 64;
    const cardHeight = 24;
    const gap = 3;
    const startY = 34;

    cards.forEach(([label, value, color], index) => {
        const row = Math.floor(index / 4);
        const column = index % 4;

        const x = startX + column * (cardWidth + gap);
        const y = startY + row * (cardHeight + 5);

        doc.setFillColor(248, 250, 252);
        doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, "F");

        doc.setFillColor(color);
        doc.rect(x, y, 2, cardHeight, "F");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(COLORS.gray);
        doc.text(label, x + 5, y + 8);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(String(value).length > 17 ? 8 : 11);
        doc.setTextColor(COLORS.dark);
        doc.text(String(value), x + 5, y + 18);
    });
};

export const generateInventoryPDF = async (data) => {
    if (!data || !data.stats || !Array.isArray(data.products)) {
        throw new Error("Invalid inventory report data.");
    }

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setProperties({
        title: "Company-Wide Inventory Report",
        subject: "Complete inventory statistics and product details",
        creator: "Inventory Management System",
    });

    // ------------------------------------------------
    // PAGE 1: SUMMARY AND CHARTS
    // ------------------------------------------------

    doc.setFillColor(15, 118, 110);
    doc.rect(0, 0, pageWidth, 27, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.text("INVENTORY MANAGEMENT REPORT", 14, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
        `Company-wide report | Generated: ${data.generated_at || new Date().toLocaleString()}`,
        14,
        20
    );

    doc.setTextColor(COLORS.dark);
    addSummaryCards(doc, data.stats);

    // Stock status chart
    addSectionTitle(doc, "Stock Status Distribution", 14, 92);

    const stockTotal = formatNumber(
        Number(data.stats.total_products || 0)
    );

    await addSvgToPDF(
        doc,
        getDonutSvg(
            data.stock_status || [],
            "Total Products",
            stockTotal
        ),
        14,
        98,
        125,
        70
    );

    // Category inventory value chart
    addSectionTitle(doc, "Inventory Value by Category", 151, 92);

    const categoryValueItems = (data.stock_by_category || [])
        .filter((item) => Number(item.inventory_value) > 0)
        .slice(0, 6)
        .map((item) => ({
            name: item.name,
            value: Number(item.inventory_value),
        }));

    if (categoryValueItems.length) {
        await addSvgToPDF(
            doc,
            getBarChartSvg(categoryValueItems),
            151,
            98,
            132,
            70
        );
    } else {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.gray);
        doc.text("No category inventory data available.", 151, 108);
    }




    // ------------------------------------------------
    // PAGE 2: PRODUCT VALUE CHART AND CATEGORY TABLE
    // ------------------------------------------------

    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(COLORS.dark);
    doc.text("INVENTORY VALUE ANALYSIS", 14, 18);

    addSectionTitle(doc, "Top Product Inventory Values", 14, 29);

    const allValueItems = data.product_value_chart || [];

    // Show the top 5 products and combine the remaining values.
    const topValueItems = allValueItems.slice(0, 5).map((item) => ({
        name: item.name,
        value: Number(item.value),
    }));

    const remainingValue = allValueItems
        .slice(5)
        .reduce((sum, item) => sum + Number(item.value || 0), 0);

    if (remainingValue > 0) {
        topValueItems.push({
            name: "Other Products",
            value: remainingValue,
        });
    }

    if (topValueItems.length) {
        await addSvgToPDF(
            doc,
            getBarChartSvg(topValueItems),
            14,
            35,
            135,
            65
        );
    } else {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.gray);
        doc.text("No product valuation data available.", 14, 45);
    }

    // Category breakdown table
    addSectionTitle(doc, "Category-Wise Inventory Breakdown", 14, 110);

    autoTable(doc, {
        startY: 116,
        head: [[
            "Category",
            "Products",
            "Stock Quantity",
            "Inventory Value",
        ]],
        body: (data.stock_by_category || []).map((item) => [
            item.name,
            formatNumber(item.products_count),
            formatNumber(item.stock_quantity),
            formatNPR(item.inventory_value),
        ]),
        theme: "grid",
        headStyles: {
            fillColor: [15, 118, 110],
            textColor: 255,
            fontStyle: "bold",
        },
        styles: {
            font: "helvetica",
            fontSize: 9,
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252],
        },
    });

    // ------------------------------------------------
    // COMPLETE PRODUCT INVENTORY TABLE
    // ------------------------------------------------

    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(COLORS.dark);
    doc.text("COMPLETE PRODUCT INVENTORY", 14, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(COLORS.gray);
    doc.text(
        `Total products: ${formatNumber(data.products.length)}`,
        14,
        24
    );

    autoTable(doc, {
        startY: 29,
        head: [[
            "Product",
            "Category",
            "Quantity",
            "Min. Stock",
            "Purchase Price",
            "Selling Price",
            "Inventory Value",
            "Status",
        ]],
        body: data.products.map((product) => [
            product.name || "-",
            product.category?.name || "-",
            formatNumber(product.quantity),
            formatNumber(product.minimum_stock),
            formatNPR(product.purchase_price),
            formatNPR(product.selling_price),
            formatNPR(product.inventory_value),
            product.stock_status || "-",
        ]),
        theme: "grid",
        headStyles: {
            fillColor: [15, 118, 110],
            textColor: 255,
            fontStyle: "bold",
            halign: "center",
        },
        styles: {
            font: "helvetica",
            fontSize: 7.5,
            cellPadding: 2.5,
            overflow: "linebreak",
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252],
        },
        columnStyles: {
            0: { cellWidth: 43 },
            1: { cellWidth: 30 },
            2: { cellWidth: 17, halign: "right" },
            3: { cellWidth: 18, halign: "right" },
            4: { cellWidth: 33, halign: "right" },
            5: { cellWidth: 33, halign: "right" },
            6: { cellWidth: 37, halign: "right" },
            7: { cellWidth: 27 },
        },
        didParseCell: (hookData) => {
            if (hookData.section === "body" && hookData.column.index === 7) {
                const status = hookData.cell.raw;

                if (status === "Low Stock") {
                    hookData.cell.styles.textColor = [217, 119, 6];
                } else if (status === "Out of Stock") {
                    hookData.cell.styles.textColor = [220, 38, 38];
                } else if (status === "In Stock") {
                    hookData.cell.styles.textColor = [22, 163, 74];
                }
            }
        },
        margin: {
            top: 29,
            right: 14,
            bottom: 18,
            left: 14,
        },
    });

    // ------------------------------------------------
    // FOOTERS AND PAGE NUMBERS
    // ------------------------------------------------

    const totalPages = doc.internal.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page);

        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setDrawColor(226, 232, 240);
        doc.line(14, pageHeight - 13, pageWidth - 14, pageHeight - 13);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(COLORS.gray);

        doc.text(
            "Inventory Management System | Company-Wide Report",
            14,
            pageHeight - 7
        );

        doc.text(
            `Page ${page} of ${totalPages}`,
            pageWidth - 14,
            pageHeight - 7,
            { align: "right" }
        );
    }

    const date = new Date().toISOString().split("T")[0];

    doc.save(`Company-Inventory-Report-${date}.pdf`);
};

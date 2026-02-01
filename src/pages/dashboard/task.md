
# 📊 Dashboard Page – Frontend Implementation Instructions

## ❌ Remove Existing Code
- Completely delete the current dashboard page code
- Rebuild the dashboard from scratch using **ApexCharts** (already installed in the project)

---

## 📅 Global Date Filter
- Use **one global date range selector**
- Implement date picker using **rsuite DateRangePicker**
- Selected `startDate` and `endDate` must apply to **all charts**
- Date format to send in API: `YYYY-MM-DD`

---

## 🔌 APIs to Integrate

### 1️⃣ Pie Chart Data API
```
GET {{base_url}}/analysis/pie-chart-data?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

#### Response Example
```json
{
  "data": {
    "conversion_by_group": [
      { "totalCount": 1824, "conversion_by": "form" },
      { "totalCount": 4814, "conversion_by": "call" }
    ],
    "source_group": [
      { "totalCount": 254, "source": "vendor" },
      { "totalCount": 225, "source": "navbar" },
      { "totalCount": 6159, "source": "venue" }
    ],
    "platform_group": [
      { "totalCount": 5747, "platform": "mob" },
      { "totalCount": 891, "platform": "des" }
    ]
  }
}
```

---

## 🥧 Pie Charts Requirements (3 Charts)

Create **three separate pie chart components**:

### 1. Conversion By Type Pie Chart
- Data source: `conversion_by_group`
- Label field: `conversion_by`
- Value field: `totalCount`

### 2. Source Wise Conversion Pie Chart
- Data source: `source_group`
- Label field: `source`
- Value field: `totalCount`

### 3. Platform Wise Conversion Pie Chart
- Data source: `platform_group`
- Label field: `platform`
- Value field: `totalCount`

> Each pie chart must be implemented as a **separate reusable component**.

---

## 2️⃣ Top 20 Venues & Vendors API
```
GET {{base_url}}/analysis/top20?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

#### Response Example
```json
{
  "data": {
    "venue": [
      { "count": 257, "slug": "crystal-palace" },
      { "count": 237, "slug": "shalimar-bagh-club" }
    ],
    "vendor": [
      { "count": 33, "slug": "nautiyal-movies-photography" },
      { "count": 24, "slug": "wedding-riwaz" }
    ]
  }
}
```

---

## 📊 Charts Requirements (2 Charts)

### 1. Top 20 Venues Chart
- Chart type: **Bar chart** (or similar)
- X-axis: `slug`
- Y-axis: `count`
- Data is already sorted (do not re-sort)

### 2. Top 20 Vendors Chart
- Same configuration as venue chart
- Separate component

> Venue and Vendor charts must be **two different components**.

---

## 🧩 Mandatory Component Structure

All dashboard-related components must be placed inside dashboard folder:

```


---

## 🎯 Technical Constraints
- Chart library: **ApexCharts**
- Date picker library: **rsuite**
- State management: React local state only
- Each chart component should:
  - Handle loading state
  - Handle empty/no-data state gracefully

---

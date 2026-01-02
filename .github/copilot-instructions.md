# ShaadiBazaar CMS - AI Agent Instructions

## Project Overview
A React-based admin CMS for managing wedding venues, vendors, leads, and user management. Built with **Vite + React 19 + RSuite 6 + Zustand**.

## Architecture

### Routing & Role-Based Navigation
- Routes defined in [App.jsx](../src/App.jsx) with lazy-loaded pages
- Navigation config in [navConfig.jsx](../src/navConfig.jsx) - three role levels: `superAdmin`, `admin`, `sales`
- Auth token stored as `x4976gtylCC` in localStorage (validated via `/api/authanticateToken/admin`)

### Page Structure Pattern
Each feature follows this folder structure (see `src/pages/venue/venuelist/`):
```
featurename/
├── index.jsx       # Re-exports main component
├── FeatureList.jsx # Main list component with Table, pagination, search
└── Cells.jsx       # Custom RSuite Table cell components (ActionCell, ToggleCell, etc.)
```

### State Management
- **Zustand store** at [store/store.js](../store/store.js) - user state only, accessed via `getUser()`, `setUser()`, `deleteUser()`
- **Local state** for list pages with localStorage persistence for pagination (see VenueList.jsx pattern)
- **SWR** available for data fetching but most pages use direct fetch calls

### API Layer (`src/utils/request/`)
```javascript
import api from './apiRequest.js'           // Public endpoints
import { authApi } from './apiRequest.js'   // Protected endpoints (adds Bearer token)
import { authMultiFormApi } from './apiRequest.js' // File uploads
```
- Base URL from `VITE_BACKEND_URI` env variable
- API responses follow `{ success: boolean, data: {...}, message: string }` pattern

## Component Patterns

### RSuite Usage
- **Always** use RSuite components: `Table`, `Form`, `Modal`, `Drawer`, `SelectPicker`, `TagPicker`, `Toggle`, `Pagination`
- Icons: Use `@rsuite/icons` or wrap `react-icons` with RSuite's `Icon` component:
  ```jsx
  import { Icon } from '@rsuite/icons';
  import { MdDashboard } from 'react-icons/md';
  <Icon as={MdDashboard} />
  ```

### Table Lists
All list pages follow this pattern from [VenueList.jsx](../src/pages/venue/venuelist/VenueList.jsx):
- RSuite `Table` with `Column`, `HeaderCell`, `Cell`
- Pagination state: `count`, `limit`, `page`
- Search with debounce, localStorage persistence
- Custom cells imported from `Cells.jsx`

### Forms
- Use RSuite `Form` component with controlled state via `useState`
- SelectPicker data format: `[{ label: "Display", value: "id" }]`
- Rich text: CKEditor 5 (`@ckeditor/ckeditor5-react`)
- File uploads use `authMultiFormApi`

### Modals Pattern
```jsx
const [open, setOpen] = useState(false);
<Modal open={open} onClose={() => setOpen(false)}>
  <Modal.Header><Modal.Title>Title</Modal.Title></Modal.Header>
  <Modal.Body>...</Modal.Body>
  <Modal.Footer><Button onClick={handleSubmit}>Submit</Button></Modal.Footer>
</Modal>
```

## Data Fetching Helpers
Located in `src/utils/request/`:
- `getCities.js`, `getLocalities.js` - Location data
- `getVenueCategories.js`, `getVendorCategories.js` - Category dropdowns
- `getVenues.js`, `getVendors.js` - Entity lists by city

## Key Conventions

### Naming
- Pages: `FeatureName/` folder with `FeatureNameList.jsx` or `FeatureNameForm.jsx`
- Create forms: `vendorcreateform/VendorAddForm.jsx`
- Update forms: `vendorupdateform/VendorUpdateForm.jsx`

### Styling
- Global styles in [src/styles/global.css](../src/styles/global.css) - uses Poppins font
- RSuite's built-in classes preferred over custom CSS
- Sidebar is fixed position with `page-container` padding adjustment

### Notifications
- Use `react-hot-toast` for all user feedback:
  ```jsx
  import toast from 'react-hot-toast';
  toast.success("Created successfully");
  toast.error(error.message);
  ```

## Development Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint check
```

## Adding New Features
1. Create page folder in `src/pages/featurename/`
2. Add `index.jsx` exporting main component
3. Create `FeatureList.jsx` following existing list patterns
4. Create `Cells.jsx` for custom table cells
5. Add lazy import in `App.jsx`
6. Add route in `App.jsx` Routes
7. Add nav item in `navConfig.jsx` under appropriate role array

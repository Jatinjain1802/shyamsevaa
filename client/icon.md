# Icon Usage Analysis

This document outlines the **Symbol Icons** (Google Material Symbols) used exhaustively throughout the **User Section** of the application.

> **Note**: As requested, references to specific usage of `react-icons` and `lucide-react` have been excluded from this list to focus purely on the symbol system usage.

## Material Symbols (Google Fonts)

The application extensively uses **Google Material Symbols** via the `material-symbols-outlined` class. Below is the comprehensive list of every symbol token identified in the codebase, categorized by its primary function.

### 1. Spiritual & Domain Specific
Icons representing religious concepts, temple activities, and offerings.

| Icon Token | Usage Location(s) | Context / Purpose |
| :--- | :--- | :--- |
| `temple_hindu` | `Navbar`, `Footer`, `Temples`, `TempleDetail`, `PanchangSection`, `HeroSection` | **Primary Brand Icon** used for logos, section headers for Temples, and decorative elements. |
| `self_improvement` | `Poojas`, `PanchangSection`, `Cart`, `Muhurat` | Represents **Spirituality/Poojas**, Yoga (in Panchang), and Pooja items in Cart. |
| `volunteer_activism` | `TempleDetail`, `ChadawaSection`, `Cart` | Represents **Chadawa/Donations** and associated tabs or items. |
| `flare` | `HeroSection`, `PujaSection`, `Muhurat` | Decorative "sparkle" or "auspicious energy" icon used in headers. |
| `potted_plant` | `HeroSection` | Decorative icon for hero backgrounds. |
| `auto_stories` | `HeroSection` | Icon for "Scriptures" or "Knowledge" links. |
| `local_florist` | `BookingCheckout` | Represents **Add-ons** (flowers/offerings) in the booking summary. |
| `auto_awesome` | `TempleDetail` | Used for the "Poojas" tab active state. |
| `home_storage` | `PoojaDetail` | Represents the "Venue" or "At Home" modality (if applicable). |

### 2. Time, Astrology & Calendar
Icons used for the Panchang, Muhurat, and Scheduling features.

| Icon Token | Usage Location(s) | Context / Purpose |
| :--- | :--- | :--- |
| `calendar_month` | `Poojas`, `PujaSection`, `Muhurat` | General calendar icon, "Today's Panchang", or empty state for dates. |
| `calendar_today` | `PanchangSection` | Section header icon for the Panchang module. |
| `schedule` | `LiveDarshanSection`, `Muhurat` | Represents "Time", "Timings Card", or schedule info. |
| `sunny` | `Muhurat` | Loading spinner for the Muhurat calculation process. |
| `dark_mode` | `Muhurat` | Represents **Tithi** (Lunar Day). |
| `stars` | `Muhurat` | Represents **Nakshatra** (Constellation). |
| `history_edu` | `Muhurat` | Represents **Karan** (Half Tithi). |
| `wb_sunny` | `PanchangSection`, `Muhurat` | Represents **Sunrise**. |
| `wb_twilight` | `PanchangSection`, `Muhurat` | Represents **Sunset** or **Moonset**. |
| `bedtime` | `Muhurat` | Represents **Moonrise**. |
| `verified` | `Muhurat` | Indicates **Abhijit Muhurat** (Auspicious time). |
| `block` | `Muhurat` | Indicates **Rahu Kaalam** (Inauspicious time). |

### 3. Commerce & Booking
Icons used in the Cart, Checkout flow, and pricing summaries.

| Icon Token | Usage Location(s) | Context / Purpose |
| :--- | :--- | :--- |
| `shopping_cart` | `Navbar`, `Cart` | Main Cart icon in navbar; Empty state illustration in Cart. |
| `shopping_bag` | `Cart`, `BookingCheckout` | Default item icon in Cart (if type unknown); Order Summary header. |
| `receipt_long` | `Cart` | **Order Summary** header icon. |
| `payments` | `BookingCheckout` | **Total Amount** display in checkout. |
| `edit_calendar` | `BookingCheckout` | **Booking Details** form header. |
| `edit_note` | `BookingCheckout` | **Sankalp Details** form header. |
| `local_shipping` | `Cart` | "Prasad Delivery" trust badge. |
| `savings` | `PoojaDetail` | (Variant) Included in some detail cards for pricing. |

### 4. User, Identity & Social
Icons related to user accounts, participation profiles, and social sharing.

| Icon Token | Usage Location(s) | Context / Purpose |
| :--- | :--- | :--- |
| `account_circle` | `Navbar` | User Profile / Login trigger. |
| `person` | `BookingCheckout` | Single devotee icon; Form for Sankalp details. |
| `groups` | `BookingCheckout` | Multiple devotees (3+) group icon. |
| `favorite` | `BookingCheckout` | Couple/Pair (2 persons) devotee icon. |
| `share` | `TempleDetail`, `PoojaDetail`, `Footer` | Share button icon. |
| `mail` | `Footer` | Contact email link. |
| `call` | `Footer` | Contact phone link. |

### 5. Navigation & Actions
Icons used for moving through the app or performing interactive actions.

| Icon Token | Usage Location(s) | Context / Purpose |
| :--- | :--- | :--- |
| `home` | `TempleDetail`, `PoojaDetail` | Breadcrumb "Home" link. |
| `arrow_back` | `TempleDetail`, `PoojaDetail`, `Cart`, `BookingCheckout` | Back button for navigation. |
| `arrow_forward` | `Cart`, `BookingCheckout`, `PoojaDetail` | "Proceed", "Next", or "Book Now" buttons. |
| `chevron_right` | `TempleDetail`, `PoojaDetail` | Breadcrumb separator. |
| `arrow_right_alt` | `PoojaDetail`, `PanchangSection` | Formatting for "Read More" or "View All" links. |
| `keyboard_double_arrow_right` | `PujaSection` | "View All Rituals" button icon. |
| `close` | `Temples`, `Poojas` | Close button (e.g., clearing search/filters). |
| `search` | `Navbar`, `Temples` | Search input indicator. |
| `search_off` | `Temples`, `Poojas` | Empty search results state. |
| `refresh` | `Temples`, `TempleDetail`, `Poojas`, `PoojaDetail` | Retry button in error states. |
| `add` | `Cart`, `PoojaDetail` | Increment quantity button. |
| `remove` | `Cart` | Decrement quantity button. |
| `add_circle` | `Cart` | Icon indicating an "Add-on" item. |
| `delete` | `Cart` | Remove item action. |
| `play_circle` | `LiveDarshanSection` | Video play button overlay. |
| `videocam` | `Cart` | "Live Darshan" trust badge. |

### 6. Status, Feedback & System
Icons used for notifications, validation, and system states.

| Icon Token | Usage Location(s) | Context / Purpose |
| :--- | :--- | :--- |
| `check_circle` | `PoojaDetail`, `Muhurat` | Feature list bullet point; Toast success state. |
| `done` | `PoojaDetail` | Selection confirmation checkmark. |
| `error` | `Temples`, `TempleDetail`, `Poojas`, `PoojaDetail` | Error message state (large red icon). |
| `warning` | `TempleDetail` (Toast) | Warning notification state. |
| `info` | `TempleDetail` (Toast) | Info notification state. |
| `sentiment_sad` | `Cart` | Empty Cart illustration (bouncing face). |
| `location_on` | `TempleDetail`, `PoojaDetail`, `Cart`, `UnifiedCard` | Location pin for Temple/Venue. |
| `notifications` | `Navbar` | Notification Bell. |
| `notifications_active` | `Muhurat` | "Get Daily Alerts" subscription card. |
| `verified_user` | `Cart`, `BookingCheckout`, `PoojaDetail` | "Secure Checkout" or "Verified" trust badge. |
| `support_agent` | `Cart` | "24/7 Support" trust badge. |
| `image` | `UnifiedCard` | Placeholder for missing images. |

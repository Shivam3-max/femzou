# FemZou store policies (drafts)

Drafts of the five policies Shopify supports, written for an Indian D2C cosmetics store. Every value the client must confirm is marked `[CONFIRM: …]`; search for `[CONFIRM` before publishing. These are a starting point, not legal advice: have a lawyer or CA review the final text.

| File | Shopify policy | Public URL |
|---|---|---|
| `privacy-policy.html` | Privacy policy (replaces Shopify's generic template) | `/policies/privacy-policy` |
| `refund-policy.html` | Refund policy | `/policies/refund-policy` |
| `terms-of-service.html` | Terms of service | `/policies/terms-of-service` |
| `shipping-policy.html` | Shipping policy | `/policies/shipping-policy` |
| `contact-information.html` | Contact information | `/policies/contact-information` |

## Details to get from the client

One answer fills every placeholder of the same name.

**Business identity**
- Legal form of MAC Vision Biotech: Private Limited, Proprietorship or LLP
- Registered address. Two addresses are in use today: the footer shows *Khasra No. 503, H.B. No. 122, Ground Floor, Baddi Nalagarh Road, Village Dhmala, Kalka, Panchkula, Haryana 133302*, while Shopify's store address is *Plot No. 51, HSIIDC Industrial Estate, Kalka, Haryana 133302*.
- GSTIN, and CIN if it is a company
- Court city for disputes (drafted as Panchkula, Haryana)

**Contacts**
- Official email. The site footer uses `macvisionbiotech@gmail.com`; Shopify's store email and the current privacy policy use `femzou22@gmail.com`.
- Official phone. The footer uses +91 70185 32162; Shopify's store address uses +91 98057 00090.
- Grievance Officer's name (can be the owner)
- Customer-care hours (drafted as Monday to Saturday, 10 am to 6 pm)

**Refunds and shipping**
- Damaged or wrong items: replacement first, or the customer's choice of replacement or refund
- Business days to start a refund (drafted as 3)
- Cash-on-delivery refunds: bank transfer or UPI only, or store credit as an option
- Limit for refunding return postage where reverse pickup isn't available (drafted as ₹100)
- Shipping charge below ₹499, and any extra cash-on-delivery fee
- Whether re-shipping after a failed delivery is charged
- Whether tracking is also sent on WhatsApp
- Payment gateway and courier names for the privacy policy

## Putting them live

1. Fill every `[CONFIRM: …]` and set the "Last updated" dates.
2. In Shopify admin, go to **Settings → Policies** and paste each policy into its box. Shopify then shows them at `/policies/...` and links them at checkout.
3. Point the footer's **Help** menu (Online Store → Navigation → `footer-help`) at `/policies/shipping-policy` and `/policies/refund-policy`, and add `/policies/contact-information`.
4. Delete or unpublish the old pages `/pages/shipping-policy` and `/pages/refund-policy`, and add URL redirects from them to the new `/policies/...` addresses.
5. Make sure the FAQ page and the footer show the same email, phone and address as the policies.

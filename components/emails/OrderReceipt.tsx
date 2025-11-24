import {
    Body,
    Container,
    Head,
    Hr,
    Img,
    Preview,
    Section,
    Text,
    Html,
} from "@react-email/components";

import { Order } from "@/types/orderTypes";

export default function OrderReceipt({ order }: { order: Order }) {
    const orderId = order.id.slice(0, 8).toUpperCase();
    const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Html>
            <Head />
            <Preview>Your order #{orderId} has been received!</Preview>

            <Body style={styles.body}>
                <Container style={styles.container}>
                    {/* HEADER WITH BRAND */}
                    <Section style={styles.header}>
                        <Text style={styles.brandName}>Drip Fit</Text>
                        <Text style={styles.headerSubtitle}>Order Receipt</Text>
                    </Section>

                    {/* SUCCESS MESSAGE */}
                    <Section style={styles.successBox}>
                        <Text style={styles.successIcon}>✓</Text>
                        <Text style={styles.successTitle}>Order Confirmed!</Text>
                        <Text style={styles.successText}>
                            Thank you for your purchase. We&apos;ve received your order and will send you a shipping confirmation once your items are on their way.
                        </Text>
                    </Section>

                    {/* ORDER SUMMARY CARD */}
                    <Section style={styles.cardWrapper}>
                        <Section style={styles.summaryCard}>
                            <table style={{ width: "100%", marginBottom: "16px" }}>
                                <tr>
                                    <td style={{ verticalAlign: "top" }}>
                                        <Text style={styles.summaryLabel}>Order Number</Text>
                                        <Text style={styles.summaryValue}>#{orderId}</Text>
                                    </td>
                                    <td style={{ verticalAlign: "top", textAlign: "right" }}>
                                        <Text style={styles.summaryLabel}>Order Date</Text>
                                        <Text style={styles.summaryValueRight}>{date}</Text>
                                    </td>
                                </tr>
                            </table>

                            <Hr style={styles.thinHr} />

                            <table style={{ width: "100%", marginBottom: "12px" }}>
                                <tr>
                                    <td>
                                        <Text style={styles.summaryLabel}>Status</Text>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <Text style={styles.statusBadge}>{capitalize(order.status)}</Text>
                                    </td>
                                </tr>
                            </table>

                            <table style={{ width: "100%", marginBottom: "12px" }}>
                                <tr>
                                    <td>
                                        <Text style={styles.summaryLabel}>Items</Text>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <Text style={styles.summaryText}>
                                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                        </Text>
                                    </td>
                                </tr>
                            </table>

                            <table style={{ width: "100%" }}>
                                <tr>
                                    <td>
                                        <Text style={styles.summaryLabel}>Shipping to</Text>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <Text style={styles.summaryText}>
                                            {order.city}, {order.country}
                                        </Text>
                                    </td>
                                </tr>
                            </table>
                        </Section>
                    </Section>

                    {/* ORDER ITEMS */}
                    <Section style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Order Items</Text>
                    </Section>

                    <Section style={styles.cardWrapper}>
                        <Section style={styles.itemsContainer}>
                            {order.items.map((item, index) => (
                                <Section key={item.id}>
                                    <table width="100%" style={{ borderCollapse: "collapse" }}>
                                        <tr>
                                            {/* IMAGE */}
                                            <td style={{ width: "60px", padding: "6px 0" }}>
                                                {item.product.imgSrc[0] && (
                                                    <Img
                                                        src={item.product.imgSrc[0]}
                                                        width="50"
                                                        height="50"
                                                        style={styles.itemImage}
                                                        alt={item.product.title}
                                                    />
                                                )}
                                            </td>

                                            {/* DETAILS */}
                                            <td style={{ paddingLeft: "14px", verticalAlign: "top" }}>
                                                <Text style={styles.itemName}>{item.product.title}</Text>
                                                <Text style={styles.itemMeta}>
                                                    {item.product.category} • {item.product.gender}
                                                </Text>
                                                <Text style={styles.itemMeta}>
                                                    {item.variant?.color} - {item.variant?.size}
                                                </Text>
                                                <Text style={styles.itemQuantity}>Qty: {item.quantity} x 
                                                    <Text style={styles.itemUnitPrice}>
                                                         ${item.price.toFixed(2)} each
                                                    </Text>
                                                </Text>

                                            </td>

                                            {/* PRICE */}
                                            <td
                                                style={{
                                                    textAlign: "right",
                                                    verticalAlign: "top",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <Text style={styles.itemTotalPrice}>
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </Text>
                                            </td>
                                        </tr>
                                    </table>

                                    {index < order.items.length - 1 && <Hr style={styles.itemDivider} />}
                                </Section>
                            ))}
                        </Section>

                    </Section>

                    {/* TOTAL */}
                    <Section style={styles.cardWrapper}>
                        <Section style={styles.totalSection}>
                            <Section style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Subtotal</Text>
                                <Text style={styles.totalValue}>${order.totalPrice.toFixed(2)}</Text>
                            </Section>
                            <Section style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Shipping</Text>
                                <Text style={styles.totalValue}>Free</Text>
                            </Section>
                            <Hr style={styles.thinHr} />
                            <Section style={styles.totalRow}>
                                <Text style={styles.grandTotalLabel}>Total</Text>
                                <Text style={styles.grandTotalValue}>${order.totalPrice.toFixed(2)}</Text>
                            </Section>
                        </Section>
                    </Section>

                    {/* SHIPPING ADDRESS */}
                    <Section style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Shipping Address</Text>
                    </Section>

                    <Section style={styles.cardWrapper}>
                        <Section style={styles.addressCard}>
                            <Text style={styles.addressLine}>{order.shippingAddress}</Text>
                            <Text style={styles.addressLine}>
                                {order.city}
                                {order.state ? `, ${order.state}` : ""} {order.postalCode}
                            </Text>
                            <Text style={styles.addressLine}>{order.country}</Text>
                            <Section style={styles.phoneSection}>
                                <Text style={styles.phoneLabel}>Contact Phone</Text>
                                <Text style={styles.phoneNumber}>{order.phoneNumber}</Text>
                            </Section>
                        </Section>
                    </Section>

                    {/* FOOTER */}
                    <Section style={styles.footer}>
                        <Text style={styles.footerText}>
                            © 2025 DripFit. All rights reserved.
                        </Text>
                        <Text style={styles.footerLinks}>
                            Track Order • Customer Support • Return Policy
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = {
    body: {
        backgroundColor: "#f4f7fa",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        padding: "40px 20px",
        margin: 0,
    },
    container: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        maxWidth: "600px",
        margin: "0 auto",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
    },
    header: {
        textAlign: "center" as const,
        padding: "40px 30px 30px",
        borderBottom: "3px solid #4F46E5",
    },
    brandName: {
        fontSize: "28px",
        fontWeight: "700" as const,
        color: "#4F46E5",
        margin: "0 0 8px 0",
        letterSpacing: "1px",
    },
    headerSubtitle: {
        fontSize: "16px",
        color: "#64748B",
        margin: 0,
        fontWeight: "500" as const,
    },
    successBox: {
        textAlign: "center" as const,
        padding: "40px 30px",
        background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
        margin: "0",
    },
    successIcon: {
        fontSize: "48px",
        color: "#22C55E",
        margin: "0 0 16px 0",
        display: "inline-block",
        backgroundColor: "#ffffff",
        width: "70px",
        height: "70px",
        lineHeight: "70px",
        borderRadius: "50%",
        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)",
    },
    successTitle: {
        fontSize: "24px",
        fontWeight: "700" as const,
        color: "#166534",
        margin: "0 0 12px 0",
    },
    successText: {
        fontSize: "15px",
        color: "#15803D",
        lineHeight: "1.6",
        margin: 0,
    },
    cardWrapper: {
        padding: "0 20px",
        marginTop: "20px",
    },
    summaryCard: {
        padding: "20px",
        backgroundColor: "#F8FAFC",
        borderRadius: "10px",
        border: "1px solid #E2E8F0",
        marginBottom: "20px",
    },
    summaryHeader: {
        display: "table" as const,
        width: "100%",
        marginBottom: "16px",
    },
    summaryLabel: {
        fontSize: "13px",
        color: "#64748B",
        margin: "0 0 6px 0",
        textTransform: "uppercase" as const,
        letterSpacing: "0.5px",
        fontWeight: "600" as const,
    },
    summaryValue: {
        fontSize: "16px",
        color: "#1E293B",
        fontWeight: "700" as const,
        margin: 0,
    },
    summaryValueRight: {
        fontSize: "16px",
        color: "#1E293B",
        fontWeight: "700" as const,
        margin: 0,
        textAlign: "right" as const,
    },
    summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    },
    summaryText: {
        fontSize: "14px",
        color: "#334155",
        margin: 0,
    },
    statusBadge: {
        fontSize: "13px",
        color: "#1E40AF",
        backgroundColor: "#DBEAFE",
        padding: "6px 14px",
        borderRadius: "20px",
        fontWeight: "600" as const,
        margin: 0,
        display: "inline-block",
    },
    thinHr: {
        borderColor: "#E2E8F0",
        margin: "16px 0",
        borderWidth: "1px",
    },
    sectionHeader: {
        padding: "0 20px",
        marginTop: "30px",
        marginBottom: "16px",
    },
    sectionTitle: {
        fontSize: "18px",
        fontWeight: "700" as const,
        color: "#1E293B",
        margin: 0,
    },
    itemsContainer: {
        padding: "20px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "10px",
        marginBottom: "20px",
    },
    itemCard: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "10px 0",
    },
    itemImage: {
        width: "50px",
        height: "50px",
        borderRadius: "6px",
        objectFit: "cover" as const,
        border: "1px solid #E2E8F0",
        marginRight: "12px",
    },
    itemDetails: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as const,
    },
    itemPriceSection: {
        textAlign: "right" as const,
        minWidth: "80px",
    },
    itemName: {
        fontSize: "16px",
        fontWeight: "600" as const,
        color: "#1E293B",
        margin: "0 0 6px 0",
    },
    itemMeta: {
        fontSize: "13px",
        color: "#64748B",
        margin: "0 0 8px 0",
    },
    itemQuantity: {
        fontSize: "14px",
        color: "#475569",
        margin: "0 0 4px 0",
    },
    itemUnitPrice: {
        fontSize: "13px",
        color: "#64748B",
        margin: 0,
    },
    itemTotalPrice: {
        fontSize: "18px",
        fontWeight: "700" as const,
        color: "#1E293B",
        margin: 0,
    },
    itemDivider: {
        borderColor: "#F1F5F9",
        margin: "16px 0",
    },
    totalSection: {
        padding: "20px",
        backgroundColor: "#F8FAFC",
        borderRadius: "10px",
        border: "1px solid #E2E8F0",
        marginBottom: "20px",
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "12px",
    },
    totalLabel: {
        fontSize: "15px",
        color: "#475569",
        margin: 0,
    },
    totalValue: {
        fontSize: "15px",
        color: "#1E293B",
        fontWeight: "600" as const,
        margin: 0,
    },
    grandTotalLabel: {
        fontSize: "18px",
        color: "#1E293B",
        fontWeight: "700" as const,
        margin: 0,
    },
    grandTotalValue: {
        fontSize: "24px",
        color: "#4F46E5",
        fontWeight: "700" as const,
        margin: 0,
    },
    addressCard: {
        padding: "20px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "10px",
        marginBottom: "20px",
    },
    addressLine: {
        fontSize: "15px",
        color: "#334155",
        margin: "0 0 8px 0",
        lineHeight: "1.5",
    },
    phoneSection: {
        marginTop: "16px",
        paddingTop: "16px",
        borderTop: "1px solid #F1F5F9",
    },
    phoneLabel: {
        fontSize: "13px",
        color: "#64748B",
        margin: "0 0 6px 0",
        textTransform: "uppercase" as const,
        letterSpacing: "0.5px",
        fontWeight: "600" as const,
    },
    phoneNumber: {
        fontSize: "15px",
        color: "#1E293B",
        fontWeight: "600" as const,
        margin: 0,
    },
    footer: {
        textAlign: "center" as const,
        padding: "30px",
        borderTop: "1px solid #E2E8F0",
    },
    footerText: {
        fontSize: "13px",
        color: "#64748B",
        margin: "0 0 8px 0",
    },
    footerLinks: {
        fontSize: "12px",
        color: "#94A3B8",
        margin: 0,
    },
}
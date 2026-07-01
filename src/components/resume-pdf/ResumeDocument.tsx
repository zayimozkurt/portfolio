import { ExtendedUserModel } from '@/types/db/extended-user.model';
import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Fragment } from 'react';

const NAVY = '#1f4e79';
const LINK = '#1155cc';
const TEXT = '#111111';
const MUTED = '#333333';

const styles = StyleSheet.create({
    page: {
        paddingVertical: 40,
        paddingHorizontal: 48,
        fontFamily: 'Tinos',
        fontSize: 9.5,
        lineHeight: 1.35,
        color: TEXT,
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
        color: NAVY,
    },
    headline: {
        fontSize: 12.5,
        fontWeight: 'bold',
        color: NAVY,
        marginTop: 1,
        marginBottom: 4,
    },
    contactLine: {
        fontSize: 9,
        color: MUTED,
        marginBottom: 1,
    },
    link: {
        color: LINK,
        textDecoration: 'underline',
    },
    section: {
        marginTop: 12,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 11.5,
        fontWeight: 'bold',
        color: NAVY,
    },
    sectionRule: {
        flex: 1,
        height: 1,
        backgroundColor: NAVY,
        marginLeft: 6,
        marginBottom: 2,
    },
    paragraph: {
        color: TEXT,
    },
    entry: {
        marginBottom: 8,
    },
    entryHeader: {
        fontWeight: 'bold',
        color: TEXT,
    },
    bold: {
        fontWeight: 'bold',
    },
    bulletRow: {
        flexDirection: 'row',
        marginTop: 1,
    },
    bulletMark: {
        width: 9,
    },
    bulletText: {
        flex: 1,
    },
});

function formatDate(value: Date | string | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function dateRange(start: Date | string | null | undefined, end: Date | string | null | undefined, isCurrent: boolean): string {
    const from = formatDate(start);
    const to = isCurrent ? 'Present' : formatDate(end);
    if (!from && !to) return '';
    return `${from} - ${to}`;
}

function hrefOf(value: string): string {
    const trimmed = value.trim();
    if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return `mailto:${trimmed}`;
    return `https://${trimmed}`;
}

function displayOf(value: string): string {
    return value
        .trim()
        .replace(/^(https?:\/\/)?(www\.)?/i, '')
        .replace(/\/$/, '');
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={styles.section} wrap={false}>
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <View style={styles.sectionRule} />
            </View>
            {children}
        </View>
    );
}

function Bullets({ text }: { text: string }) {
    const lines = text
        .split('\n')
        .map((line) => line.trim().replace(/^[-•*]\s*/, ''))
        .filter((line) => line.length > 0);

    return (
        <>
            {lines.map((line, index) => (
                <View key={index} style={styles.bulletRow}>
                    <Text style={styles.bulletMark}>-</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                </View>
            ))}
        </>
    );
}

export function ResumeDocument({ user }: { user: ExtendedUserModel }) {
    const skillNames = user.skills.map((skill) => skill.name);

    return (
        <Document title={`${user.fullName} - CV`} author={user.fullName}>
            <Page size="A4" style={styles.page}>
                <Text style={styles.name}>{user.fullName}</Text>
                {user.headline ? <Text style={styles.headline}>{user.headline}</Text> : null}

                <Text style={styles.contactLine}>
                    {user.email ? (
                        <Link src={`mailto:${user.email}`} style={styles.link}>
                            {user.email}
                        </Link>
                    ) : null}
                    {user.email && user.location ? <Text> | </Text> : null}
                    {user.location ? <Text>{user.location}</Text> : null}
                </Text>

                {user.contacts.length > 0 ? (
                    <Text style={styles.contactLine}>
                        {user.contacts.map((contact, index) => (
                            <Fragment key={contact.id}>
                                {index > 0 ? <Text> | </Text> : null}
                                <Link src={hrefOf(contact.value)} style={styles.link}>
                                    {displayOf(contact.value)}
                                </Link>
                            </Fragment>
                        ))}
                    </Text>
                ) : null}

                {user.about ? (
                    <Section title="About">
                        <Text style={styles.paragraph}>{user.about.trim()}</Text>
                    </Section>
                ) : null}

                {skillNames.length > 0 ? (
                    <Section title="Skills">
                        <Text style={styles.paragraph}>{skillNames.join(', ')}</Text>
                    </Section>
                ) : null}

                {user.portfolioItems.length > 0 ? (
                    <Section title="Projects">
                        {user.portfolioItems.map((item) => {
                            const itemSkills = 'skills' in item && Array.isArray(item.skills)
                                ? (item.skills as { name: string }[]).map((skill) => skill.name)
                                : [];
                            return (
                                <View key={item.id} style={styles.entry} wrap={false}>
                                    <Text style={styles.entryHeader}>{item.title}</Text>
                                    {item.description ? (
                                        <Text style={styles.paragraph}>
                                            <Text style={styles.bold}>Brief: </Text>
                                            {item.description}
                                        </Text>
                                    ) : null}
                                    {itemSkills.length > 0 ? (
                                        <Text style={styles.paragraph}>
                                            <Text style={styles.bold}>Tech Stack: </Text>
                                            {itemSkills.join(', ')}
                                        </Text>
                                    ) : null}
                                </View>
                            );
                        })}
                    </Section>
                ) : null}

                {user.experiences.length > 0 ? (
                    <Section title="Experience">
                        {user.experiences.map((experience) => {
                            const header = [
                                experience.company,
                                experience.title,
                                dateRange(experience.startDate, experience.endDate, experience.isCurrent),
                            ]
                                .filter(Boolean)
                                .join(' | ');
                            const expSkills = experience.skills.map((skill) => skill.name);
                            return (
                                <View key={experience.id} style={styles.entry} wrap={false}>
                                    <Text style={styles.entryHeader}>{header}</Text>
                                    {expSkills.length > 0 ? (
                                        <Text style={styles.paragraph}>
                                            <Text style={styles.bold}>Tech Stack: </Text>
                                            {expSkills.join(', ')}
                                        </Text>
                                    ) : null}
                                    {experience.description ? <Bullets text={experience.description} /> : null}
                                </View>
                            );
                        })}
                    </Section>
                ) : null}

                {user.educations.length > 0 ? (
                    <Section title="Education">
                        {user.educations.map((education) => {
                            const header = [
                                education.school,
                                education.degree,
                                education.fieldOfStudy,
                                dateRange(education.startDate, education.endDate, education.isCurrent),
                            ]
                                .filter(Boolean)
                                .join(' | ');
                            return (
                                <View key={education.id} style={styles.entry} wrap={false}>
                                    <Text style={styles.entryHeader}>{header}</Text>
                                    {education.description ? (
                                        <Text style={styles.paragraph}>{education.description}</Text>
                                    ) : null}
                                </View>
                            );
                        })}
                    </Section>
                ) : null}
            </Page>
        </Document>
    );
}

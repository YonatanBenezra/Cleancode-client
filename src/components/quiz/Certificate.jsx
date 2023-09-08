import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    color: "black",
    padding: "20pt",
    fontFamily: "Times-Roman",
    fontSize: "24pt",
    textAlign: "center",
    border: "20pt solid #e9c46a",
    width: "100%",
    height: "563pt",
  },
  logo: {
    color: "#e9c46a",
    marginBottom: "20pt",
  },
  marquee: {
    color: "#e9c46a",
    fontSize: "36pt",
    margin: "20pt",
  },
  assignment: {
    marginBottom: "15pt",
  },
  person: {
    borderBottom: "2pt solid black",
    fontSize: "32pt",
    fontStyle: "italic",
    margin: "20pt auto",
    width: "400pt",
  },
  reason: {
    marginBottom: "20pt",
    fontSize: "18pt",
  },
});

const Certificate = ({ username, score }) => (
  <Document>
    <Page size="A4">
      <View style={styles.container}>
        <Text style={styles.logo}>Clean Code</Text>
        <Text style={styles.marquee}>
          Certificate of Completion Javascript Quiz!
        </Text>
        <Text style={styles.assignment}>This certificate is presented to</Text>
        <Text style={styles.person}>{username}</Text>
        <Text style={styles.reason}>
          For completing the Javascript Quiz with a score of {score}% on
          10/10/2019
        </Text>
      </View>
    </Page>
  </Document>
);

export default Certificate;

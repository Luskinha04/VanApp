import { View, Image, StyleSheet } from "react-native";

export default function Banner() {
  return (
    <View style={styles.imageBox}>
        <Image
          style={styles.imageHeader}
          source={require("@/image/login/logo.png")}
        />
        <Image
          style={styles.imageHeader}
          source={require("@/image/login/van.png")}
        />
      </View>
  )
}

const styles = StyleSheet.create({
  imageBox: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  imageHeader: {
    width: 120,
    height: 120,
  },
});
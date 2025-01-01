import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Banner from "@/components/Banner";
import { Link, Stack } from "expo-router";

const buttons = [
  { text: "Aluno", image: require("@/image/login/aluno.png"), color: "#F2CB05" },
  { text: "Motorista", image: require("@/image/login/motorista.png"), color: "#32A62E" },
  { text: "Admin", image: require("@/image/login/config.png"), color: "#0DC4D9" },
];

export default function index() {
  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack.Screen
        options={{
          title: "Home"
        }}
      />
      <Banner />
      <View style={styles.box}>
        <View>
          <Image></Image>
        </View>

        <Text style={styles.title}>
          Selecione o Ambiente em que Deseja Fazer o Login
        </Text>
        {buttons.map(({ image, text, color }, index) => (
          <View key={index} style={styles.arrButton}>
            <Image source={image} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: color }]}>
                <Link style={{ textAlign: 'center' }} href={{
                  pathname: "/login/[type]",
                  params: { type: text.toLowerCase() }
                }}>{text}</Link>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "90%",
    height: "60%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#A6A6A6",
    margin: 10,
  },
  title: {
    width: "90%",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  arrButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "80%",
  },
  btn: {
    height: 40,
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    width: "100%",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  }
});

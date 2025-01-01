import Header from "@/components/Header";
import { Link } from "expo-router";
import { StyleSheet, View, TouchableOpacity } from "react-native";

export default function admin() {

  return (
    <>
      <Header title="Login do Admin" text="Voltar" link="/" />
      <View style={styles.box}>
        <View style={styles.secondBox}>

          <TouchableOpacity style={styles.btn}>
            <Link
              href={{
                pathname: "/register/[type]",
                params: { type: "aluno" }
              }}
              style={styles.btnText}>
              Cadastrar Aluno
            </Link>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, { backgroundColor: "#32A62E" }]}>
            <Link
              href={{
                pathname: "/register/[type]",
                params: { type: "motorista" }
              }}
              style={styles.btnText}>
              Cadastrar Motorista
            </Link>
          </TouchableOpacity>

        </View>
        <View style={styles.secondBox}>

          <TouchableOpacity style={styles.btn}>
            <Link
              href={{
                pathname: "/edit/[type]",
                params: { type: "aluno" }
              }}
              style={styles.btnText}>
              Editar Alunos
            </Link>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, { backgroundColor: "#32A62E" }]}>
            <Link
              href={{
                pathname: "/edit/[type]",
                params: { type: "motorista" }
              }}
              style={styles.btnText}>
              Editar Motorista
            </Link>
          </TouchableOpacity>

        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    height: "100%",
  },
  secondBox: {
    marginVertical: 20,
  },
  btn: {
    width: "90%",
    height: 50,
    backgroundColor: "#F2CB05",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
    margin: 'auto',
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  btnText: {
    fontSize: 20,
    fontWeight: "bold",
    width: '100%',
    textAlign: 'center',
  },
});

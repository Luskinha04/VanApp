import Banner from "@/components/Banner";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "@/firebaseConfig";
import Header from "@/components/Header";

export default function EditById() {
  const [type, setType] = useState("");
  interface FetchData {
    name: string;
    phone: string;
    email: string;
    address: string;
    number: string;
    complement: string;
    [key: string]: string;
  }

  const [fetchData, setFetchData] = useState<FetchData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    number: "",
    complement: "",
  });

  const [authenticationData, setAuthenticationData] = useState({
    password: "",
  });

  const { id } = useLocalSearchParams();
  const ref = doc(db, "users", Array.isArray(id) ? id[0] : id);
  const refTrip = doc(db, "viagens", Array.isArray(id) ? id[0] : id);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          setType(docSnap.data().type);
          setFetchData(docSnap.data() as FetchData);
        } else {
          console.log("No such document!");
        }

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchDataAsync();
  }, []);

  const updatePassword = async () => {
    try {
      fetch(`https://api-van-kuvq.vercel.app/apiFirebase/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: authenticationData.password,
          idToken: id,
        }),
      });
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
    }
  };

  const updateData = async () => {
    try {
      await updateDoc(ref, {
        name: fetchData.name,
        phone: fetchData.phone,
        address: fetchData.address,
        number: fetchData.number,
        complement: fetchData.complement,
      });
      await updateDoc(refTrip, {
        name: fetchData.name,
      });

      updatePassword();
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const fields = [
    { name: "Nome Completo", key: "name" },
    { name: "E-mail", key: "email" },
    { name: "Telefone", key: "phone" },
  ];

  if (type === "aluno") {
    fields.push(
      { name: "Endereço", key: "address" },
      { name: "Número", key: "number" },
      { name: "Complemento", key: "complement" }
    );
  }

  const isDataValid = () =>
    fetchData.name && fetchData.phone && (type !== "aluno" || (fetchData.address && fetchData.number));

  return (
    <ScrollView style={styles.scroll}>
      <Header title={`Editar ${type} ${fetchData.name}`} text="Voltar" link={"/edit/aluno"} />
      <Banner />
      <View style={styles.box}>
        <Text style={styles.title}>Edite os campos do {type}.</Text>
        <View style={styles.container}>
          {fields.map((field) => (
            <View key={field.key} style={styles.fieldContainer}>
              <Text>{field.name}:</Text>
              <TextInput
                style={styles.placeholder}
                value={fetchData[field.key] || ""}
                onChangeText={(text) => {
                  if (field.key != 'email') {
                    setFetchData((prev) => ({ ...prev, [field.key]: text }));
                  }
                }}
              />
            </View>
          ))}

          <View style={styles.fieldContainer}>
            <Text>Senha</Text>
            <TextInput
              style={styles.placeholder}
              value={authenticationData.password}
              onChangeText={((text) => { setAuthenticationData((prev) => ({ ...prev, password: text })); })}
            />
          </View>

        </View>
        <View
          style={[
            styles.boxBtn,
            !isDataValid() && { backgroundColor: "#A6A6A6" },
          ]}
        >
          <TouchableOpacity
            disabled={!isDataValid()}
            onPress={updateData}
          >
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    width: "100%",
  },
  box: {
    marginVertical: 10,
    marginHorizontal: "5%",
    maxWidth: "90%",
    width: "100%",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 15,
  },
  container: {
    width: "100%",
  },
  fieldContainer: {
    marginBottom: 15,
  },
  placeholder: {
    backgroundColor: "#A6A6A6",
    height: 40,
    borderRadius: 10,
    width: "100%",
    color: "#FFF",
    paddingLeft: 10,
    marginTop: 5,
  },
  boxBtn: {
    display: "flex",
    width: "60%",
    maxWidth: "80%",
    alignItems: "center",
    backgroundColor: "#32A62E",
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
    alignSelf: "center",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

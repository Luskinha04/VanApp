import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import Banner from "@/components/Banner";
import { useEffect, useState } from "react";
import { collection, doc, DocumentData, getDoc, onSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Header from "@/components/Header";

export default function motorista() {
  const { type } = useLocalSearchParams();
  const [fetchUsers, setFetchUsers] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [fetchTrip, setFetchTrip] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  const [studentWithTrip, setStudentWithTrip] = useState<DocumentData[]>([]);
  const [studentWithoutTrip, setStudentWithoutTrip] = useState<DocumentData[]>([]);

  const [userName, setUserName] = useState<string>('');

  const todayFormatted = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      if (typeof type === 'string') {
        const unsubscribeUser = onSnapshot(collection(db, 'users'), (snapshot) => {
          const filteredDocs: QueryDocumentSnapshot<DocumentData>[] = [];
          snapshot.forEach((doc) => {
            filteredDocs.push(doc);
          });
          setFetchUsers(filteredDocs);
        });
        const unsubscribeTrip = onSnapshot(collection(db, 'viagens'), (snapshot) => {
          const filteredDocsTrip: QueryDocumentSnapshot<DocumentData>[] = [];
          snapshot.forEach((doc) => {
            filteredDocsTrip.push(doc);
          });
          setFetchTrip(filteredDocsTrip);
        });

        return () => {
          unsubscribeUser();
          unsubscribeTrip();
        };
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    function UserWithTrip() {
      const user: any[] = [];
      fetchUsers.forEach((userDoc) => {
        if (userDoc.data().type == 'aluno') {
          user.push(userDoc.data().name);
        }
      });
      const userWithTrip: any[] = [];
      const userWithoutTrip: any[] = [];
      fetchTrip.forEach((tripDoc) => {
        if (user.includes(tripDoc.data().name) && tripDoc.data().type == 'aluno') {
          if (tripDoc.data().date == todayFormatted && tripDoc.data().value != '') {
            userWithTrip.push(tripDoc.data());
          } else {
            userWithoutTrip.push(tripDoc.data());
          }
        }
      });
      setStudentWithTrip(userWithTrip);
      setStudentWithoutTrip(userWithoutTrip);
    }

    UserWithTrip();
  }, [fetchUsers, fetchTrip]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const options = [
    { text: "Vou e Volto", value: "first" },
    { text: "Hoje não Vou", value: "second" },
    { text: "Somente Irei", value: "third" },
    { text: "Somente Voltarei", value: "fourth" },
  ];

  return (
    <ScrollView
      style={{
        width: "100%",
        height: "100%",
        paddingTop: 5
      }}
    >
      <Header text="Voltar" title={`Olá, ${userName}`} />
      <Banner />
      <View style={[styles.container]}>
        <View style={[styles.box]}>
          <Text style={[styles.title]}>Alunos Confirmados</Text>
          {studentWithTrip.map((student, index) => (
            <View key={index} style={[styles.lineStudents]}>
              <Text style={[styles.text]}>{student.name}</Text>
              <Text style={[styles.text, { textAlign: 'right' }]}>
                {options.find(option => option.value === student.value)?.text}
              </Text>
            </View>
          ))}
        </View>
        <View style={[styles.box]}>
          <Text style={[styles.title]}>Alunos Aguardando Confirmação</Text>
          {studentWithoutTrip.map((student, index) => (
            <View key={index} style={[styles.lineStudents]}>
              <Text style={[styles.text]}>{student.name}</Text>
              <Text style={[styles.text, { textAlign: 'right' }]}>Pendente</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    flex: 1,
    margin: 'auto',
    backgroundColor: "#A6A6A6",
    borderRadius: 8,
  },
  box: {
    width: "100%",
    alignItems: "center",
    margin: 'auto',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  lineStudents: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1
  },
  text: {
    fontSize: 18,
    width: "50%",
    padding: 5,
  }
});
import { View, Text, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import LogoutBtn from "./LogoutBtn";

interface HeaderProps {
  title: string;
  text: string;
  link?: string;
}

export default function Header({ title, text, link }: HeaderProps) {

  return (
    <View style={[styles.header]}>
      <Text style={[styles.text]}>{title}</Text>
      {link ? <Link href={link as any}><Text style={[styles.text]}>{text}</Text></Link> : <LogoutBtn />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFF',
    color: 'white',
    padding: 10,
    fontSize: 20,
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  btn: {
    backgroundColor: '#F2CB05',
    padding: 5,
    borderRadius: 5,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
  }
});
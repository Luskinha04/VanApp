import { View, Text, StyleSheet, Image, TextInput } from "react-native";

import { FC, ReactNode } from "react";

import { ImageSourcePropType } from "react-native";

interface FormInputProps {
  children: ReactNode;
  name: string;
  image: ImageSourcePropType;
}

export const FormInput: FC<FormInputProps> = ({ children, name, image }) => {
  return (
    <View style={[styles.boxInside]}>
      <Text style={[styles.textPlaceholder]}>{name}</Text>
      <View style={[styles.boxPlaceholder]}>
        <Image source={image} style={[styles.icon]} />
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boxInside: {
    width: "100%",
    marginTop: 10,
    margin: 'auto'
  },
  boxPlaceholder: {
    marginTop: 5,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textPlaceholder: {
    marginLeft: 30,
  },

  icon: {
    width: 25,
    height: 25,
  }
});
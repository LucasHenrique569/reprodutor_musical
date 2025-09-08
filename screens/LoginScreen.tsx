import React, { useCallback } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import { Alert, SafeAreaView, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function LoginScreen({navigation}: any) {

  const autenticar = useCallback( async () =>{
    try{
      
      const temLeitor = await LocalAuthentication.hasHardwareAsync();
      if (!temLeitor) {
        return Alert.alert("Autenticação", "Seu dispositivo não possui leitor biométrico.");
      }

      const temDigitalCadastrada = await LocalAuthentication.isEnrolledAsync();
      if (!temDigitalCadastrada) {
        return Alert.alert("Autenticação", "Nenhuma digital cadastrada neste dispositivo.");
      }

      const sucesso  = await LocalAuthentication.authenticateAsync();

      if(sucesso){
         return navigation.navigate("Home");     
      }
    } catch(err){
        Alert.alert("Ocorreu um erro no processo de biométrico!" + err);
    }

  },[navigation]);

    return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Acesse com sua biometria</Text>

      <TouchableOpacity style={styles.fingerprintButton} onPress={autenticar}>
        <Icon name="fingerprint" size={90} color="#4CAF50" />
      </TouchableOpacity>

      <Text style={styles.infoText}>Toque no ícone para autenticar</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  fingerprintButton: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 100,
    marginBottom: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
  },
});
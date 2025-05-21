import { StyleSheet } from 'react-native';

// Color palette
export const colors = {
  background: '#1E3D58',        // Deep Navy
  loginBox: '#FDF6EC',           // Cream White
  primaryButton: '#A3D5FF',       // Ice Blue
  primaryButtonText: '#1E3D58',   // Navy on primary buttons
  secondaryText: '#6BAED6',       // Soft Blue
  text: '#102B40',                // Dark Navy
  lightGrey: '#CCCCCC',           // Input field borders
  cancelButton: '#FA020B',        // Red for cancel actions
};

// CreateGameScreen styles
export const createGameScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.loginBox,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 20,
  },
  section: {
    width: '100%',
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 8,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    padding: 10,
  },
  stepButton: {
    paddingHorizontal: 20,
  },
  stepText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  countText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  startButton: {
    marginTop: 30,
    width: '100%',
    backgroundColor: colors.primaryButton,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  startText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryButtonText,
  },
});

// GameScreen (modal & messages) styles
export const gameScreenStyles = StyleSheet.create({
  turnMessageContainer: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    zIndex: 10,
  },
  turnMessageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  victoryContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  victoryText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 10,
  },
  attackCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  attackCardLabel: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  plusSign: {
    fontSize: 20,
    marginHorizontal: 4,
  },
  secondaryText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  actionBtnsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: colors.primaryButton,
  },
  cancelBtn: {
    backgroundColor: colors.cancelButton,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});

// LobbyScreen styles
export const lobbyScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.loginBox,
    alignItems: 'center',
    paddingHorizontal: 20,   // left+right
    paddingBottom: 20,       // bottom only
    // paddingTop: 0,         // optional explicit reset
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginVertical: 20,
    color: colors.text,
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primaryButton,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
  },
  gameItem: {
    backgroundColor: '#e0dfd5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    width: '100%',
  },
  gameText: {
    color: colors.text,
    fontSize: 16,
  },
  emptyText: {
    marginTop: 20,
    color: '#555',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 40,
  },
  saveButton: {
    marginLeft: 8,
    backgroundColor: '#7DA9C6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

// LoginScreen styles
export const loginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '85%',
    backgroundColor: colors.loginBox,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#FFFFFF',
  },
  primaryBtn: {
    width: '100%',
    height: 50,
    backgroundColor: colors.primaryButton,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  primaryBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryButtonText,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  secondaryText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  loginBtn: {
    marginLeft: 8,
    backgroundColor: '#7DA9C6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  loginBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

// CardView styles
export const cardViewStyles = StyleSheet.create({
  card: {
    width: 70,
    height: 100,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  text: {
    fontSize: 23,
    fontWeight: 'bold',
  },
});

// GameBoard styles
export const gameBoardStyles = StyleSheet.create({
  board: {
    flex: 1,
  },
  playerContainer: {
    alignItems: 'center',
  },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  middleRow: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'center',
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  center: {
    width: 70,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#795548',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 40,
  },
  deck: {
    fontSize: 30,
    color: '#fff',
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  bottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 20,
    color: '#fff',
  },
  health: {
    marginBottom: 4,
    fontSize: 17,
    color: '#fff',
  },
  hiddenCard: {
    width: 50,
    height: 70,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    backgroundColor: '#ccc',
  },
  hiddenCardSymbol: {
    fontSize: 24,
  },
  stats: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '600',
    color: '#fff',
  },

});


export const ruleScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.loginBox,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGrey,
    marginVertical: 24,
  },
});
export const SettingsScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.loginBox },
  content: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  /* row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 }, */
  form: { marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#7DA9C6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  button2: {
    backgroundColor: '#7DA9C6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
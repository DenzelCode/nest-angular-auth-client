export const playSound = (sound: string) => {
  sound = `../../../assets/tones/${sound}.mp3`
  sound && (new Audio(sound)).play()
}
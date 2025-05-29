import styles from "./Input.module.scss";
// import { useTheme } from "../../config/ThemeContext";
export default function Input({
  label,
  id,
  value,
  onChange,
  // defaultValue,
  // colorScheme,
  // fontSize,
  // width,
}) {
  // const { currentTheme } = useTheme();
  // const { accentColor, greyColor } = currentTheme;
  // const inputType = {
  //   fontSize: fontSize || "1.5rem",
  //   width: width || "100%",
  //   ...(colorScheme === "primary" && {
  //     color: accentColor[2],
  //     backgroundColor: greyColor[2],
  //   }),
  //   ...(colorScheme === "secondary" && {
  //     color: "#ff6347",
  //     backgroundColor: "#f0f0f0",
  //   }),
  //   ...(colorScheme === "transparent" && {
  //     color: accentColor[2],
  //     backgroundColor: "transparent",
  //   }),
  // };
  return (
    <>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        // style={inputType}
        id={id}
        className={styles.input}
        value={value}
        onChange={onChange}
        // defaultValue={defaultValue}
      />
    </>
  );
}

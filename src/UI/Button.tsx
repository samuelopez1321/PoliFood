type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
    type: "button" | "submit";
}




export  default function Button({
    children,
    onClick,
    disabled = false,
    variant = 'primary',
    type = 'button'
} Props) {
    
    const base = "";
    const variants ={
        primary: "",
        secondary: "",
        tertiary: "",
        danger: ""
    }
    return (
        <button className={"${base}"}>

        </button>
    )
}
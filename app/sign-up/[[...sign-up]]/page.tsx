import { SignUp } from "@clerk/nextjs";

export default function SignUpPage(){
  return(
    <div className="signup-form">
      <SignUp />
    </div>
  );
}
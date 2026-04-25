interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

export default function AuthToggle({ isLogin, onToggle }: AuthToggleProps) {
    return (
        <div className="mt-8 text-center">
            <p className="text-13 text-gray-500 font-medium">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={onToggle} className="text-gray-900 font-bold hover:underline underline-offset-4 transition-all hover:cursor-pointer">
                    {isLogin ? "Sign up" : "Sign in"}
                </button>
            </p>
        </div>
    );
}
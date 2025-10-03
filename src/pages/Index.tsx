import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MessageCircle, CheckCircle2 } from "lucide-react";

const Index = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<"+" | "-">("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Gera uma nova pergunta matemática
  const generateQuestion = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    const op = Math.random() > 0.5 ? "+" : "-";
    
    // Se for subtração, garante que o resultado seja positivo
    if (op === "-") {
      setNum1(Math.max(n1, n2));
      setNum2(Math.min(n1, n2));
    } else {
      setNum1(n1);
      setNum2(n2);
    }
    setOperator(op);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const correctAnswer = operator === "+" ? num1 + num2 : num1 - num2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const answer = parseInt(userAnswer.trim());
    
    if (isNaN(answer)) {
      toast.error("Por favor, digite um número válido");
      return;
    }

    if (answer === correctAnswer) {
      setIsVerified(true);
      toast.success("Correto! Você pode falar conosco agora 🎉", {
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
    } else {
      setAttempts(prev => prev + 1);
      toast.error("Resposta incorreta. Tente novamente!");
      setUserAnswer("");
      
      // Gera nova pergunta após 3 tentativas erradas
      if (attempts >= 2) {
        generateQuestion();
        setAttempts(0);
        toast.info("Nova pergunta gerada!");
      }
    }
  };

  const handleWhatsAppClick = () => {
    // Substitua o número abaixo pelo seu número do WhatsApp (com DDI e DDD)
    // Formato: 55 (Brasil) + DDD + Número
    const phoneNumber = "5511999999999"; // Exemplo: 55 11 99999-9999
    const message = encodeURIComponent("Olá! Resolvi o captcha e gostaria de conversar.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-foreground">
            Verificação Simples
          </CardTitle>
          <CardDescription className="text-base">
            Resolva a conta matemática para continuar
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isVerified ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-8 text-center border-2 border-border">
                <p className="text-sm text-muted-foreground mb-3">Quanto é:</p>
                <p className="text-5xl font-bold text-foreground mb-2">
                  {num1} {operator} {num2} = ?
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Digite sua resposta"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-center text-xl h-14 border-2"
                  autoFocus
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                >
                  Verificar
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in-0 zoom-in-95 duration-700">
              <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-6 text-center">
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-3" />
                <p className="text-lg font-semibold text-foreground">
                  Verificação concluída!
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Agora você pode falar com a gente
                </p>
              </div>

              <Button
                onClick={handleWhatsAppClick}
                className="w-full h-14 text-lg font-semibold gap-2 bg-primary hover:bg-primary/90"
                size="lg"
              >
                <MessageCircle className="h-5 w-5" />
                Fale com a gente no WhatsApp
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;

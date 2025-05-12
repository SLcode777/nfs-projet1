import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
      </CardHeader>
      <CardContent>
        We just sent you an email ! Click on the link inside to get verified
        !{" "}
      </CardContent>
    </Card>
  );
}

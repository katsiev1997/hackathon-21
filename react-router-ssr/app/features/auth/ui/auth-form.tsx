import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Loader2Icon, Lock, Mail } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "~/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/shared/components/ui/card";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import { cn, formatFieldErrors } from "~/shared/lib/utils";

type AuthTab = "login" | "signup";

/** Показывать текст ошибки после blur/ввода или после неудачной отправки (иначе «Повторите пароль» без фокуса молчит). */
function showFieldValidationMessage(meta: {
	isTouched: boolean;
	isValid: boolean;
	errors: unknown[];
}): boolean {
	return !meta.isValid && (meta.isTouched || meta.errors.length > 0);
}

const authSchema = z.object({
	email: z.email("Введите корректный email адрес"),
	password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
	confirmPassword: z.string(),
});

export function AuthForm() {
	const [tab, setTab] = useState<AuthTab>("login");
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(false);
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: authSchema,
			onBlur: authSchema,
		},
		onSubmit: async ({ value }) => {
			const { confirmPassword: _, ...data } = value;
			console.log(tab === "login" ? "Login:" : "Signup:", data);
			void navigate("/dashboard");
		},
	});

	const handleTabChange = (newTab: AuthTab) => {
		setTab(newTab);
		form.reset();
		setShowPassword(false);
	};

	const confirmPassword = useCallback(
		({ value }: { value: string }) => {
			return value !== form.getFieldValue("password")
				? "Пароли не совпадают"
				: undefined;
		},
		[form],
	);

	return (
		<Card className="w-full max-w-md border-0 bg-card py-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
			<CardHeader className="items-center space-y-1 px-6 text-center">
				<CardTitle className="text-xl font-semibold tracking-tight">
					{tab === "login" ? "С возвращением" : "Создать аккаунт"}
				</CardTitle>
				<CardDescription>
					{tab === "login"
						? "Введите данные для входа в аккаунт"
						: "Заполните форму для регистрации"}
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col gap-6 px-6">
				<div
					className="flex rounded-lg bg-muted/80 p-1 ring-1 ring-border/60"
					role="tablist"
					aria-label="Режим входа"
				>
					{(["login", "signup"] as const).map((t) => (
						<button
							key={t}
							type="button"
							role="tab"
							aria-selected={tab === t}
							className={cn(
								"flex-1 rounded-md py-2 text-sm font-medium transition-all",
								tab === t
									? "bg-card text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10"
									: "text-muted-foreground hover:text-foreground",
							)}
							onClick={() => handleTabChange(t)}
						>
							{t === "login" ? "Вход" : "Регистрация"}
						</button>
					))}
				</div>

				<form
					className="flex flex-col gap-5"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					noValidate
				>
					<form.Field
						name="email"
						children={(field) => {
							const isInvalid = showFieldValidationMessage(field.state.meta);
							return (
								<div className="grid gap-2">
									<Label htmlFor={field.name}>Email</Label>
									<div className="relative">
										<Mail
											className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
											aria-hidden
										/>
										<Input
											id={field.name}
											name={field.name}
											type="email"
											autoComplete="email"
											placeholder="name@company.com"
											className="h-10 pl-9"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange((e.target as HTMLInputElement).value)
											}
											aria-invalid={isInvalid}
										/>
									</div>
									{isInvalid && (
										<p className="text-xs text-destructive">
											{formatFieldErrors(field.state.meta.errors)}
										</p>
									)}
								</div>
							);
						}}
					/>

					<form.Field
						name="password"
						children={(field) => {
							const isInvalid = showFieldValidationMessage(field.state.meta);
							return (
								<div className="grid gap-2">
									<div className="flex items-center gap-2">
										<Label htmlFor={field.name}>Пароль</Label>
										{tab === "login" && (
											<Link
												to="/auth/forgot-password"
												className="ml-auto text-xs font-medium text-primary hover:underline"
											>
												Забыли пароль?
											</Link>
										)}
									</div>
									<div className="relative">
										<Lock
											className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
											aria-hidden
										/>
										<Input
											id={field.name}
											name={field.name}
											type={showPassword ? "text" : "password"}
											autoComplete={
												tab === "login" ? "current-password" : "new-password"
											}
											placeholder="••••••••"
											className="h-10 pl-9 pr-10"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange((e.target as HTMLInputElement).value)
											}
											aria-invalid={isInvalid}
										/>
										<button
											type="button"
											className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
											onClick={() => setShowPassword((v) => !v)}
											aria-label={
												showPassword ? "Скрыть пароль" : "Показать пароль"
											}
										>
											{showPassword ? (
												<EyeOff className="size-4" />
											) : (
												<Eye className="size-4" />
											)}
										</button>
									</div>
									{isInvalid && (
										<p className="text-xs text-destructive">
											{formatFieldErrors(field.state.meta.errors)}
										</p>
									)}
								</div>
							);
						}}
					/>

					{tab === "signup" && (
						<form.Field
							name="confirmPassword"
							validators={{
								onBlur: confirmPassword,
								onSubmit: confirmPassword,
							}}
							children={(field) => {
								const isInvalid = showFieldValidationMessage(field.state.meta);
								return (
									<div className="grid gap-2">
										<Label htmlFor={field.name}>Повторите пароль</Label>
										<div className="relative">
											<Lock
												className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
												aria-hidden
											/>
											<Input
												id={field.name}
												name={field.name}
												type="password"
												autoComplete="new-password"
												placeholder="••••••••"
												className="h-10 pl-9"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														(e.target as HTMLInputElement).value,
													)
												}
												aria-invalid={isInvalid}
											/>
										</div>
										{isInvalid && (
											<p className="text-xs text-destructive">
												{formatFieldErrors(field.state.meta.errors)}
											</p>
										)}
									</div>
								);
							}}
						/>
					)}

					<div className="flex items-center gap-2">
						<input
							id="remember"
							type="checkbox"
							checked={remember}
							onChange={(e) =>
								setRemember((e.target as HTMLInputElement).checked)
							}
							className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
						/>
						<Label
							htmlFor="remember"
							className="cursor-pointer font-normal text-muted-foreground"
						>
							Запомнить на 30 дней
						</Label>
					</div>

					<Button
						type="submit"
						size="lg"
						className="h-10 w-full font-medium"
						disabled={form.state.isSubmitting}
					>
						{form.state.isSubmitting ? (
							<Loader2Icon className="size-4 animate-spin" />
						) : tab === "login" ? (
							"Войти"
						) : (
							"Создать аккаунт"
						)}
					</Button>
				</form>

				<p className="text-center text-xs leading-relaxed text-muted-foreground">
					Входя в систему, вы соглашаетесь с{" "}
					<a
						href="/terms"
						className="font-medium text-foreground underline-offset-4 hover:underline"
					>
						Условиями использования
					</a>{" "}
					и{" "}
					<a
						href="/privacy"
						className="font-medium text-foreground underline-offset-4 hover:underline"
					>
						Политикой конфиденциальности
					</a>
					.
				</p>
			</CardContent>
		</Card>
	);
}

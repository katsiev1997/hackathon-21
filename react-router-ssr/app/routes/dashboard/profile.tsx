import { useGetProfile } from "~/entities/user";
import { Badge } from "~/shared/components/ui/badge";
import { Button } from "~/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/shared/components/ui/card";
import { Skeleton } from "~/shared/components/ui/skeleton";

export function meta() {
	return [{ title: "User Profile — HackForge" }];
}

export default function Profile() {
	const { data, isLoading, isError, error, refetch, isFetching } = useGetProfile();

	if (isLoading) {
		return (
			<div className="space-y-4 p-4 md:p-6">
				<Skeleton className="h-7 w-44" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-28 w-full" />
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="p-4 md:p-6">
				<Card>
					<CardHeader>
						<CardTitle>Не удалось загрузить профиль</CardTitle>
						<CardDescription>
							{error instanceof Error
								? error.message
								: "Попробуйте обновить страницу или войти заново."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => void refetch()} disabled={isFetching}>
							Повторить
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-4 p-4 md:p-6">
			<Card>
				<CardHeader>
					<CardTitle>Профиль</CardTitle>
					<CardDescription>Основные данные пользователя</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="grid gap-1">
						<p className="text-xs text-muted-foreground">Имя</p>
						<p className="text-sm font-medium">{data.name}</p>
					</div>
					<div className="grid gap-1">
						<p className="text-xs text-muted-foreground">Email</p>
						<p className="text-sm">{data.email}</p>
					</div>
					<div className="grid gap-1">
						<p className="text-xs text-muted-foreground">Роль</p>
						<Badge variant="secondary" className="w-fit">
							{data.role}
						</Badge>
					</div>
					<div className="grid gap-1">
						<p className="text-xs text-muted-foreground">Статус поиска команды</p>
						<Badge variant={data.lookingForTeam ? "default" : "outline"} className="w-fit">
							{data.lookingForTeam ? "Ищу команду" : "В команде / не ищу"}
						</Badge>
					</div>
					{data.teamId ? (
						<div className="grid gap-1">
							<p className="text-xs text-muted-foreground">Team ID</p>
							<p className="text-sm break-all">{data.teamId}</p>
						</div>
					) : null}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Навыки</CardTitle>
					<CardDescription>Текущий стек из профиля</CardDescription>
				</CardHeader>
				<CardContent>
					{data.skills.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{data.skills.map((skill) => (
								<Badge key={skill} variant="outline">
									{skill}
								</Badge>
							))}
						</div>
					) : (
						<p className="text-sm text-muted-foreground">Навыки пока не добавлены</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

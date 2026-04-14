import { DashboardLayout } from "@/app/layouts/dashboard-layout";
import { ForgotPasswordPage, RecoveryPasswordPage } from "@/pages/auth-page";
import { HomePage } from "@/pages/home-page";
import { TeamBoardPage } from "@/pages/team-board-page";
import { DashboardPlaceholderPage } from "@/shared/components/dashboard-placeholder-page";
import { Route, Router, Switch } from "wouter-preact";

export function RouterProvider() {
  return (
    <Router>
      <Route path='/' component={HomePage} />
      <Route path='/auth/forgot-password' component={ForgotPasswordPage} />
      <Route path='/auth/recovery-password' component={RecoveryPasswordPage} />

      <Route path='/dashboard' nest>
        <DashboardLayout>
          <Switch>
            <Route path='/' component={TeamBoardPage} />
            <Route path='/teams'>
              <DashboardPlaceholderPage
                title='Teams Dashboard'
                description='Manage your teams and invitations.'
              />
            </Route>
            <Route path='/ideas'>
              <DashboardPlaceholderPage
                title='Ideas & Voting'
                description='Publish ideas and vote on community submissions.'
              />
            </Route>
            <Route path='/kanban'>
              <DashboardPlaceholderPage
                title='Kanban Board'
                description='Track tasks across your team workflow.'
              />
            </Route>
            <Route path='/leaderboard'>
              <DashboardPlaceholderPage
                title='Leaderboard'
                description='See team scores and hackathon progress.'
              />
            </Route>
            <Route path='/profile'>
              <DashboardPlaceholderPage
                title='User Profile'
                description='Your profile, skills, and team preferences.'
              />
            </Route>
          </Switch>
        </DashboardLayout>
      </Route>
    </Router>
  );
}

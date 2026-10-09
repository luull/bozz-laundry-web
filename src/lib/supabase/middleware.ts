import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect routes based on user role and auth status
  // Example: redirect to /login if not authenticated and accessing protected routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
  
  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // If user is authenticated, we might want to fetch their profile to check roles
    // But we avoid DB queries in middleware if possible, unless using JWT claims.
    // Assuming custom claims for role aren't set yet, we'll let page-level layouts handle deep role checks.
    
    if (isAuthRoute) {
       // redirect to appropriate dashboard based on role, for now just root or fetch profile
       const url = request.nextUrl.clone()
       url.pathname = '/' // or a loading/routing page
       return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

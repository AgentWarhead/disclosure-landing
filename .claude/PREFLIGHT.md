# PREFLIGHT.md — Disclosure (Project Starfall)
> ⚠️ Run these checks BEFORE any deploy. All must pass.

```bash
cd /home/ubuntu/.openclaw/workspace/projects/disclosure/landing

# 1. Git clean
DIRTY=$(git status --porcelain 2>/dev/null | wc -l)
[ "$DIRTY" -eq 0 ] && echo "✅ Git clean" || echo "⚠️ $DIRTY uncommitted changes"

# 2. Supabase reachable
curl -s -o /dev/null -w "%{http_code}" "https://bexjbozbrhijtjombxkm.supabase.co" --max-time 5 | grep -q "200\|301" && echo "✅ Supabase reachable" || echo "⚠️ Supabase unreachable"

# 3. Email service running
systemctl is-active disclosure-email 2>/dev/null | grep -q active && echo "✅ Email service running" || echo "❌ disclosure-email service DOWN"

# 4. First Contact sequence intact (Q1=3, Q2=1, Q3=4, Q4=2)
echo "⚠️ MANUAL: Verify FC_SEQUENCE hasn't been committed to public repo"

# 5. Disk space
FREE=$(df -BG / | tail -1 | awk '{print $4}' | tr -d 'G')
[ "$FREE" -gt 2 ] && echo "✅ Disk: ${FREE}GB free" || echo "❌ DISK LOW"
```

## When Disclosure App (React Native) is built, add:
- React/RN renderer version match
- EAS CLI check
- Google SA + Apple certs
- node_modules health

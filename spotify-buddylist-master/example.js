const buddyList = require('spotify-buddylist')

async function main () {
  const spDcCookie = 'AQB-aczZp5srdiyMR27vEQlEYtBA__cN2gzrx2YGDRyn3AXctaS041NxLSVaKeUk5M3TyqM649uXYYcIberBgUiTSbyRrSQoHNkQuZCegLa5apH8iQJnl21DNzb69Bpphf-y25x5JNp_DcsZuCoY4jQFrFXgUQQ'

  const { accessToken } = await buddyList.getWebAccessToken(spDcCookie)
  const friendActivity = await buddyList.getFriendActivity(accessToken)

  console.log(JSON.stringify(friendActivity, null, 2))
}

main()


enablePlugins(ScalaJSPlugin)

/* Key Definitions */
val javaVersion = settingKey[String]("javac source/target version")
val scalatestVersion = settingKey[String]("scalatest version")

/* Key Settings */
version in Global := "0.0-SNAPSHOT"
organization in Global := "jp.karmami"
name := "libdiplomacy"

scalaVersion in Global := "2.12.1"
javaVersion in Global := "1.8"

scalatestVersion in Global := "3.0.1"

/* Project Settings */
lazy val commonSettings = Seq(
  javacOptions ++= Seq("-source", javaVersion.value, "-target", javaVersion.value)
)

lazy val scalaTestSettings = Seq(
  libraryDependencies += "org.scalatest" %% "scalatest" % scalatestVersion.value % "test"
)

lazy val core = (project in file("core")).
  settings(commonSettings: _*).
  settings(scalaTestSettings: _*)

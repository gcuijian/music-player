package com.createdpro.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LyricExplain {
    
    static final String FORMAT = "^\\[\\d\\d\\:\\d\\d\\.\\d\\d\\].+";
    
    static final String TIME   = "^\\[\\d\\d\\:\\d\\d\\.\\d\\d\\]";

//    public static void main(String[] args) {
//        try {
//            System.out.println(LyricExplain.getLyric("一路向北.lrc"));
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
    
    public static Map<Integer, String> getLyric(String fileName, String LYRIC_PATH) throws IOException{
        File path = new File(LYRIC_PATH);
        if(!path.exists()) {
            path.mkdirs();
        }
        
        File file = new File(LYRIC_PATH, fileName);
        if(!file.exists()) {
            return null;
        }
        return LyricExplain.createMap(file);
    }
    
    private static Map<Integer, String> createMap(File file) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
        Map<Integer, String> map = new LinkedHashMap<>();
        
        String str = null;
        String text = null;
        while((str = in.readLine()) != null) {
            // 符合歌词行
            if(Pattern.matches(FORMAT, str)) {
                String time = null;
                Matcher m = Pattern.compile(TIME).matcher(str);
                if(m.find()) {
                    time = m.group();
                    text = str.replace(time, "");
                    map.put(parseTime(time), text);
                }
            }
        }
        in.close();
        return map;
    }
    
    private static Integer parseTime(String timeString) {
        timeString = timeString.replace("[", "");
        timeString = timeString.replace("]", "");
        String[] split1 = timeString.split(":");
        String[] split2 = split1[1].split("\\.");
        Integer time = Integer.parseInt(split1[0]) * 60;
        time = time + Integer.parseInt(split2[0]);
        time = time + (Integer.parseInt(split2[1])>=50 ? 1 : 0);
        return time;
    }
    
}
